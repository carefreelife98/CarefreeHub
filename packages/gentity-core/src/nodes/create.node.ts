// packages/gentity-core/src/nodes/create.node.ts

import { z } from "zod"
import { BaseNode } from "./base.node.js"
import { createLlmModel, type LlmModel } from "../llm/factory.js"
import { MARKDOWN_GUIDE } from "../prompts/markdown-guide.js"
import type { NodeCompleteSummary, NodeEventEmitter, LlmConfig } from "@carefree-studio/shared"
import type { ParsedParams, Competitor, ReviewInsights, GameConcept } from "@carefree-studio/shared"

const GameConceptSchema = z.object({
  title: z.string(),
  coreLoop: z.string(),
  mechanics: z.array(z.string()),
  targetUser: z.string(),
  differentiation: z.string(),
  monetization: z.string(),
  cpiTestPlan: z.string(),
})

interface CreateInput {
  originalQuery: string
  params: ParsedParams
  competitors: Competitor[]
  insights: ReviewInsights
  previousFeedback?: string
}

export class CreateNode extends BaseNode<CreateInput, GameConcept> {
  readonly nodeId = "create"

  private readonly model: LlmModel

  constructor(emitter: NodeEventEmitter, graphId: string, llmConfig: LlmConfig) {
    super(emitter, graphId)
    this.model = createLlmModel(llmConfig)
  }

  protected async process(input: CreateInput): Promise<GameConcept> {
    this.emitProgress("게임 아이디어를 구상하고 있어요", 50)

    const competitorSummary = input.competitors
      .slice(0, 10)
      .map((c) => `- ${c.title} (${c.platform}, ★${c.score}, ${c.installs})`)
      .join("\n")

    const insightSummary = [
      "## Strengths",
      ...input.insights.topStrengths.map((i) => `- [★${i.score}] ${i.text}`),
      "## Pain Points",
      ...input.insights.topPainPoints.map((i) => `- [★${i.score}] ${i.text}`),
      "## Unmet Needs",
      ...input.insights.unmetNeeds.map((i) => `- [★${i.score}] ${i.text}`),
    ].join("\n")

    const feedbackClause = input.previousFeedback
      ? `\n\nPREVIOUS ATTEMPT FEEDBACK (address these issues):\n${input.previousFeedback}`
      : ""

    const structured = this.model.withStructuredOutput(GameConceptSchema)
    const result = await structured.invoke([
      {
        role: "system",
        content: `You are a hyper-casual game designer. The user wants a game about "${input.originalQuery}".
Create a game concept that:
1. Stays true to the user's original idea ("${input.originalQuery}")
2. Addresses the unmet needs found in competitor reviews
3. Avoids the common pain points
4. Builds on proven strengths in the genre
5. Is differentiated from existing competitors

The game concept MUST be directly related to "${input.originalQuery}". Do not deviate from the user's theme.
${MARKDOWN_GUIDE}${feedbackClause}`,
      },
      {
        role: "user",
        content: `Original Query: ${input.originalQuery}
Genre: ${input.params.genre}
Mechanics: ${input.params.mechanics.join(", ")}

## Competitors
${competitorSummary}

## User Review Insights
${insightSummary}`,
      },
    ])

    this.emitProgress("컨셉 문서를 작성하고 있어요", 70)

    // Generate markdown document from structured concept
    const markdownResult = await this.model.invoke([
      {
        role: "system",
        content: `You are a game concept writer. Convert the structured game concept below into a beautifully formatted Korean markdown document.

Structure the document as:
# {title}

## 타겟 유저
{expand on the target user profile}

## 코어 루프
{explain the core loop in detail with bullet points}

## 게임 메커니즘
{list each mechanic with description}

## 차별화 포인트
{explain what makes this unique}

## 수익화 전략
{detail the monetization model}

## CPI 테스트 플랜
{layout the test plan with creatives and metrics}

${MARKDOWN_GUIDE}`,
      },
      {
        role: "user",
        content: JSON.stringify(result),
      },
    ])

    const markdown = typeof markdownResult.content === "string" ? markdownResult.content : ""

    return { ...(result as GameConcept), markdown } as GameConcept
  }

  protected buildSummary(result: GameConcept): NodeCompleteSummary {
    return { kind: "create", conceptTitle: result.title }
  }
}
