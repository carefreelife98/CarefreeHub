// packages/gentity-core/src/nodes/parse.node.ts

import { z } from "zod"
import { BaseNode } from "./base.node.js"
import { createLlmModel, type LlmModel } from "../llm/factory.js"
import type { NodeCompleteSummary, NodeEventEmitter, LlmConfig } from "@carefree-studio/shared"
import type { ParsedParams } from "@carefree-studio/shared"

const ParsedParamsSchema = z.object({
  keywords: z.array(z.string()).min(1).max(5),
  keywordsKo: z.array(z.string()).min(1).max(5),
  genre: z.enum(["casual", "simulation", "arcade", "puzzle", "action", "strategy", "rpg"]),
  mechanics: z.array(
    z.enum([
      "idle",
      "tycoon",
      "merge",
      "match3",
      "runner",
      "tower_defense",
      "management",
      "cooking",
      "building",
    ])
  ),
})

export class ParseNode extends BaseNode<string, ParsedParams> {
  readonly nodeId = "parse"

  private readonly model: LlmModel

  constructor(emitter: NodeEventEmitter, graphId: string, llmConfig: LlmConfig) {
    super(emitter, graphId)
    this.model = createLlmModel(llmConfig)
  }

  protected async process(query: string): Promise<ParsedParams> {
    this.emitProgress("게임 키워드를 분석하고 있어요", 50)

    const structured = this.model.withStructuredOutput(ParsedParamsSchema)
    const result = await structured.invoke([
      {
        role: "system",
        content: `You are a mobile game market analyst. Parse the user query into structured search parameters.
Extract:
- keywords: 2-5 English app store search terms that capture the user's theme. Include both the specific theme (e.g. "futsal", "soccer") AND the game style (e.g. "idle", "tycoon"). Use English terms for better app store coverage.
- keywordsKo: 2-5 Korean app store search terms for the same query. Translate and adapt for Korean market. Example: "방치형 축구", "풋살 게임".
- genre: single best matching genre
- mechanics: relevant game mechanics

Always respond in English for keywords, Korean for keywordsKo.`,
      },
      { role: "user", content: query },
    ])

    return result as ParsedParams
  }

  protected buildSummary(result: ParsedParams): NodeCompleteSummary {
    return { kind: "create", conceptTitle: result.keywords.join(", ") }
  }
}
