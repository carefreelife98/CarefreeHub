// apps/api/src/buildity/buildity.service.ts

import { Injectable } from "@nestjs/common"
import { z } from "zod"
import {
  createLlmModel,
  logger,
  MARKDOWN_GUIDE,
  MERMAID_GUIDE,
  withRetry,
} from "@carefree-studio/gentity-core"
import { DEFAULT_LLM_CONFIG } from "@carefree-studio/shared"
import { PRD_SECTIONS, SECTION_GROUPS } from "./prd-sections.js"
import type { SectionDef } from "./prd-sections.js"
import { GentityService } from "../gentity/gentity.service.js"
import type {
  ChipGenerateRequest,
  ChipRefreshRequest,
  ChipGenerateResponse,
  ChipCategory,
  PrdBuildRequest,
  PrdBuildResponse,
} from "@carefree-studio/shared"

const ChipSchema = z.object({
  chipId: z.string(),
  label: z.string(),
  isCustom: z.boolean().default(false),
})

const ChipCategorySchema = z.object({
  categoryId: z.string(),
  label: z.string(),
  icon: z.string(),
  chips: z.array(ChipSchema),
})

const CategoryListSchema = z.object({
  categories: z.array(
    z.object({
      label: z.string(),
      icon: z.string(),
    })
  ),
})

const ChipListSchema = z.object({
  chips: z.array(z.string()),
})

const ChipResponseSchema = z.object({
  categories: z.array(ChipCategorySchema),
  insightHint: z.object({
    title: z.string(),
    description: z.string(),
    highlightValues: z.array(
      z.object({
        text: z.string(),
        position: z.number(),
      })
    ),
  }),
})

@Injectable()
export class BuildityService {
  constructor(private readonly gentityService: GentityService) {}

  async generateChips(request: ChipGenerateRequest): Promise<ChipGenerateResponse> {
    const llmConfig = request.llm ?? DEFAULT_LLM_CONFIG
    logger.info("buildity:chips", `▶ generateChips`, {
      stepId: request.stepId,
      provider: llmConfig.provider,
      model: llmConfig.model,
      analysisId: request.analysisId,
    })
    const startMs = Date.now()
    const model = createLlmModel(llmConfig)
    const structured = model.withStructuredOutput(ChipResponseSchema)

    const previousContext = request.previousSteps
      .map(
        (s) =>
          `${s.stepId}: ${s.selections.map((sel) => sel.selectedChipIds.join(", ")).join("; ")}`
      )
      .join("\n")

    // analysisId로 DB에서 insights 조회
    let insightsContext = ""
    if (request.analysisId) {
      const report = await this.gentityService.getResult(request.analysisId)
      if (report?.insights) {
        insightsContext = `\n\nMarket Insights (from Gentity analysis):\n${JSON.stringify(report.insights)}`
      }
    }

    const messages = [
      {
        role: "system" as const,
        content: `You are a game PRD builder assistant. Generate categorized chip options for the "${request.stepId}" step of a game PRD.

Each category should have 3-5 chips. Generate an insight hint that explains why these options are recommended based on the game concept and market insights.
Write all labels and descriptions in Korean. Use unique chipId values (snake_case).${insightsContext}`,
      },
      {
        role: "user" as const,
        content: `Game Concept: ${JSON.stringify(request.concept)}

Previous Selections:
${previousContext || "None (first step)"}`,
      },
    ]
    const result = await withRetry(() => structured.invoke(messages), { label: "generateChips" })

    logger.info("buildity:chips", `✔ generateChips`, {
      stepId: request.stepId,
      durationMs: Date.now() - startMs,
      categories: (result as ChipGenerateResponse).categories.length,
    })
    return result as ChipGenerateResponse
  }

  async *generateChipsStream(
    request: ChipGenerateRequest
  ): AsyncGenerator<
    | { type: "plan"; total: number; labels: string[] }
    | { type: "category"; index: number; category: ChipCategory }
    | { type: "hint-chunk"; text: string }
    | { type: "retry"; attempt: number; maxRetries: number; error: string; label: string }
  > {
    const llmConfig = request.llm ?? DEFAULT_LLM_CONFIG
    logger.info("[buildity:chips-stream] ▶ generateChipsStream", {
      stepId: request.stepId,
      model: llmConfig.model,
    })
    const startMs = Date.now()
    const model = createLlmModel(llmConfig)

    const previousContext = request.previousSteps
      .map(
        (s) =>
          `${s.stepId}: ${s.selections.map((sel) => sel.selectedChipIds.join(", ")).join("; ")}`
      )
      .join("\n")

    let insightsContext = ""
    if (request.analysisId) {
      const report = await this.gentityService.getResult(request.analysisId)
      if (report?.insights) {
        insightsContext = `\n\nMarket Insights (from Gentity analysis):\n${JSON.stringify(report.insights)}`
      }
    }

    const userContent = `Game Concept: ${JSON.stringify(request.concept)}\n\nPrevious Selections:\n${previousContext || "None (first step)"}`

    // Shared queue for all steps — supports category, hint, and retry events
    type QueueItem =
      | { type: "category"; index: number; category: ChipCategory }
      | { type: "hint-chunk"; text: string }
      | { type: "retry"; attempt: number; maxRetries: number; error: string; label: string }
    const queue: QueueItem[] = []
    let resolveWait: (() => void) | null = null
    const notify = () => {
      resolveWait?.()
    }
    const makeOnRetry = (label: string) => (attempt: number, maxRetries: number, error: string) => {
      queue.push({ type: "retry", attempt, maxRetries, error, label })
      notify()
    }

    // Step 1: Generate category list
    const categoryListModel = model.withStructuredOutput(CategoryListSchema)
    const categoryListResult = await withRetry(
      () =>
        categoryListModel.invoke([
          {
            role: "system",
            content: `You are a game PRD builder. Generate 3-4 category names for the "${request.stepId}" step of a game PRD. Each category should have a short label and an emoji icon. Write labels in Korean.${insightsContext}`,
          },
          { role: "user", content: userContent },
        ]),
      { label: "chips:categories", onRetry: makeOnRetry("chips:categories") }
    )

    // Drain any retry events from Step 1
    while (queue.length > 0) yield queue.shift()!

    const categoryDefs = (categoryListResult as { categories: { label: string; icon: string }[] })
      .categories
    logger.info("[buildity:chips-stream] categories determined", {
      count: categoryDefs.length,
      labels: categoryDefs.map((c) => c.label),
    })

    // Emit plan so frontend knows total categories
    yield { type: "plan", total: categoryDefs.length, labels: categoryDefs.map((c) => c.label) }

    // Step 2: Parallel chip generation
    const completedCategories: ChipCategory[] = []

    const chipPromises = categoryDefs.map(async (catDef, catIndex) => {
      const chipLabel = `chips:${catDef.label}`
      const chipModel = model.withStructuredOutput(ChipListSchema)
      const chipResult = await withRetry(
        () =>
          chipModel.invoke([
            {
              role: "system",
              content: `You are a game PRD builder. Generate 3-5 chip option labels for the category "${catDef.label}" in the "${request.stepId}" step. Return only an array of short label strings. Write in Korean.${insightsContext}`,
            },
            { role: "user", content: userContent },
          ]),
        { label: chipLabel, onRetry: makeOnRetry(chipLabel) }
      )

      const chipLabels = (chipResult as { chips: string[] }).chips
      const category: ChipCategory = {
        categoryId: `cat_${catIndex}`,
        label: catDef.label,
        icon: catDef.icon,
        chips: chipLabels.map((label, chipIndex) => ({
          chipId: `cat_${catIndex}_chip_${chipIndex}`,
          label,
          isCustom: false,
        })),
      }

      completedCategories.push(category)
      queue.push({ type: "category", index: catIndex, category })
      notify()
    })

    const chipsAllDone = Promise.all(chipPromises)
    let chipsDone = false
    chipsAllDone.then(() => {
      chipsDone = true
      notify()
    })

    while (!chipsDone || queue.length > 0) {
      if (queue.length > 0) {
        yield queue.shift()!
      } else {
        await new Promise<void>((resolve) => {
          resolveWait = resolve
        })
      }
    }
    await chipsAllDone

    // Step 3: insightHint — streamed as markdown text
    const chipsSummary = completedCategories
      .map((c) => `${c.icon} ${c.label}: ${c.chips.map((ch) => ch.label).join(", ")}`)
      .join("\n")

    const hintStream = await model.stream([
      {
        role: "system",
        content: `You are a game PRD builder. Based on the generated chip options below, write a structured insight hint for the "${request.stepId}" step.

Use Korean and markdown formatting:
- Start with a **bold title** summarizing the recommendation
- Use bullet points (- ) for 2-3 key reasons
- Highlight important terms or numbers with **bold**
- Keep it concise (3-5 lines total)
${MARKDOWN_GUIDE}${insightsContext}

Generated chips:
${chipsSummary}`,
      },
      { role: "user", content: userContent },
    ])

    for await (const chunk of hintStream) {
      const text = typeof chunk.content === "string" ? chunk.content : ""
      if (text) {
        yield { type: "hint-chunk", text }
      }
    }
    logger.info("[buildity:chips-stream] ✔ generateChipsStream", {
      stepId: request.stepId,
      durationMs: Date.now() - startMs,
      categories: categoryDefs.length,
    })
  }

  async refreshChips(request: ChipRefreshRequest): Promise<ChipCategory> {
    const llmConfig = request.llm ?? DEFAULT_LLM_CONFIG
    logger.info(`[buildity:refresh] ▶ refreshChips`, {
      stepId: request.stepId,
      categoryId: request.categoryId,
      model: llmConfig.model,
      userPrompt: request.userPrompt ?? "(random)",
    })
    const startMs = Date.now()
    const model = createLlmModel(llmConfig)
    const structured = model.withStructuredOutput(ChipCategorySchema)

    const messages = [
      {
        role: "system" as const,
        content: `Generate new chip options for the category "${request.categoryId}" in the "${request.stepId}" step.
${request.userPrompt ? `User instruction: "${request.userPrompt}". Generate chips that reflect this instruction.` : ""}
Exclude these labels: ${request.excludeChipLabels.join(", ")}
Other categories in this step may include different topics — generate chips that are specifically relevant to "${request.categoryId}" and distinct from other categories.
Generate 3-5 new chip labels that are different from the excluded labels.
Write labels in Korean. Use unique chipId values (snake_case).`,
      },
      {
        role: "user" as const,
        content: `Game Concept: ${JSON.stringify(request.concept)}`,
      },
    ]
    const result = await withRetry(() => structured.invoke(messages), { label: "refreshChips" })

    logger.info(`[buildity:refresh] ✔ refreshChips`, {
      stepId: request.stepId,
      categoryId: request.categoryId,
      durationMs: Date.now() - startMs,
    })
    return result as ChipCategory
  }

  async buildPrd(request: PrdBuildRequest): Promise<PrdBuildResponse> {
    const llmConfig = request.llm ?? DEFAULT_LLM_CONFIG
    logger.info(`[buildity:prd] ▶ buildPrd`, {
      model: llmConfig.model,
      conceptTitle: request.concept.title,
    })
    const startMs = Date.now()
    const model = createLlmModel(llmConfig)
    const result = await model.invoke([
      {
        role: "system",
        content: `You are a game PRD writer. Generate a comprehensive PRD in Markdown format based on the game concept and the user's step-by-step selections.

Structure:
# [Game Title] - PRD
## 1. 개요
## 2. 코어 루프
## 3. 수익화 전략
## 4. 타겟 유저
## 5. 아트 스타일
## 6. 기술 요구사항
## 7. KPI & 성공 기준

Use Mermaid diagrams where they add clarity. Include at minimum:
- A flowchart for the core game loop (in section 2)
- A flowchart or sequence diagram for the monetization funnel (in section 3)
Example:
\`\`\`mermaid
flowchart TD
  A[게임 시작] --> B[레벨 진행]
  B --> C{목표 달성?}
  C -->|Yes| D[보상 지급]
  C -->|No| B
\`\`\`
${MARKDOWN_GUIDE}
${MERMAID_GUIDE}`,
      },
      {
        role: "user",
        content: `Game Concept: ${JSON.stringify(request.concept)}

Step Selections: ${JSON.stringify(request.steps)}`,
      },
    ])

    const markdown = typeof result.content === "string" ? result.content : ""
    logger.info(`[buildity:prd] ✔ buildPrd`, {
      durationMs: Date.now() - startMs,
      markdownLength: markdown.length,
    })
    return { markdown, generatedAt: new Date() }
  }

  async *buildPrdStream(
    request: PrdBuildRequest
  ): AsyncGenerator<
    | { type: "sections"; total: number; titles: string[] }
    | { type: "section"; index: number; text: string }
    | { type: "section-done"; index: number }
  > {
    const llmConfig = request.llm ?? DEFAULT_LLM_CONFIG
    logger.info(`[buildity:stream] ▶ buildPrdStream (parallel)`, {
      model: llmConfig.model,
      conceptTitle: request.concept.title,
    })
    const startMs = Date.now()

    // Emit section list first
    yield {
      type: "sections",
      total: PRD_SECTIONS.length,
      titles: PRD_SECTIONS.map((s) => s.title),
    }

    const userContent = `Game Concept: ${JSON.stringify(request.concept)}\n\nStep Selections: ${JSON.stringify(request.steps)}`
    const completedSections: Map<number, string> = new Map()

    for (const group of SECTION_GROUPS) {
      const groupSections = PRD_SECTIONS.filter((s) => s.group === group)
      logger.info(
        `[buildity:stream] Group ${group} start (${groupSections.map((s) => s.title).join(", ")})`
      )

      // Build context from previously completed groups
      const previousContext =
        completedSections.size > 0
          ? "\n\nPreviously written sections for reference:\n" +
            [...completedSections.entries()]
              .sort(([a], [b]) => a - b)
              .map(([, text]) => text)
              .join("\n\n")
          : ""

      // Collect chunks from parallel streams via a shared queue
      const queue: (
        | { type: "section"; index: number; text: string }
        | { type: "section-done"; index: number }
      )[] = []
      let resolveWait: (() => void) | null = null

      const streamSection = async (section: SectionDef) => {
        const model = createLlmModel(llmConfig)
        const stream = await model.stream([
          {
            role: "system",
            content: `You are a game PRD writer. ${section.prompt}${previousContext}`,
          },
          { role: "user", content: userContent },
        ])

        let fullText = ""
        for await (const chunk of stream) {
          const text = typeof chunk.content === "string" ? chunk.content : ""
          if (text) {
            fullText += text
            queue.push({ type: "section", index: section.index, text })
            resolveWait?.()
          }
        }
        completedSections.set(section.index, fullText)
        queue.push({ type: "section-done", index: section.index })
        resolveWait?.()
        logger.info(`[buildity:stream] Section "${section.title}" done (${fullText.length} chars)`)
      }

      // Start all sections in this group in parallel
      const allDone = Promise.all(groupSections.map(streamSection))

      // Drain the queue until all streams in this group are done
      let groupDone = false
      allDone.then(() => {
        groupDone = true
        resolveWait?.()
      })

      while (!groupDone || queue.length > 0) {
        if (queue.length > 0) {
          yield queue.shift()!
        } else {
          await new Promise<void>((resolve) => {
            resolveWait = resolve
          })
        }
      }

      // Await to propagate any errors
      await allDone
    }

    logger.info(`[buildity:stream] ✔ buildPrdStream (parallel)`, {
      durationMs: Date.now() - startMs,
      sections: completedSections.size,
    })
  }
}
