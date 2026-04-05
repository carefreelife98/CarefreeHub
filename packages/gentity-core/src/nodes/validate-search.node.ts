// packages/gentity-core/src/nodes/validate-search.node.ts

import { z } from "zod"
import { BaseNode } from "./base.node.js"
import { createLlmModel, type LlmModel } from "../llm/factory.js"
import type { NodeCompleteSummary, NodeEventEmitter, LlmConfig } from "@carefree-studio/shared"
import type { Competitor, ParsedParams } from "@carefree-studio/shared"

const SearchValidationSchema = z.object({
  passed: z.boolean(),
  relevantCount: z.number(),
  reason: z.string(),
  newKeywords: z.array(z.string()).optional(),
  newKeywordsKo: z.array(z.string()).optional(),
})

export type SearchValidation = z.infer<typeof SearchValidationSchema>

interface ValidateSearchInput {
  originalQuery: string
  competitors: Competitor[]
  parsedParams: ParsedParams
}

export class ValidateSearchNode extends BaseNode<ValidateSearchInput, SearchValidation> {
  readonly nodeId = "validate-search"

  private readonly model: LlmModel

  constructor(emitter: NodeEventEmitter, graphId: string, llmConfig: LlmConfig) {
    super(emitter, graphId)
    this.model = createLlmModel(llmConfig)
  }

  protected async process(input: ValidateSearchInput): Promise<SearchValidation> {
    this.emitProgress("경쟁작이 적절한지 확인하고 있어요", 50)

    const competitorSummary = input.competitors
      .slice(0, 20)
      .map((c) => `- ${c.title} (${c.platform}, ${c.genre}, ★${c.score})`)
      .join("\n")

    const structured = this.model.withStructuredOutput(SearchValidationSchema)
    const result = await structured.invoke([
      {
        role: "system",
        content: `You are a mobile game market analyst. Evaluate whether the search results are relevant to the user's query.

Criteria:
- Count how many competitors are genuinely related to the user's query theme
- If 3 or more competitors are relevant: passed = true
- If fewer than 3 are relevant: passed = false, suggest better search keywords

When suggesting new keywords:
- newKeywords: 2-5 English search terms (different from previous: ${input.parsedParams.keywords.join(", ")})
- newKeywordsKo: 2-5 Korean search terms (different from previous: ${input.parsedParams.keywordsKo?.join(", ") ?? "none"})
- Try broader or alternative terms that would find games in the same genre/theme

Write reason in Korean.`,
      },
      {
        role: "user",
        content: `User query: "${input.originalQuery}"

Search keywords used:
- English: ${input.parsedParams.keywords.join(", ")}
- Korean: ${input.parsedParams.keywordsKo?.join(", ") ?? "none"}

Search results (${input.competitors.length} competitors found):
${competitorSummary || "(no results)"}`,
      },
    ])

    return result as SearchValidation
  }

  protected buildSummary(result: SearchValidation): NodeCompleteSummary {
    return {
      kind: "validate-search",
      passed: result.passed,
      relevantCount: result.relevantCount,
      feedback: result.passed ? undefined : result.reason,
    }
  }
}
