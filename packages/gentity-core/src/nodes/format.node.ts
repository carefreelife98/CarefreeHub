// packages/gentity-core/src/nodes/format.node.ts

import { BaseNode } from "./base.node.js"
import type { NodeCompleteSummary, NodeEventEmitter } from "@carefree-studio/shared"
import type {
  ParsedParams,
  Competitor,
  ReviewInsights,
  GameConcept,
  GentityReport,
} from "@carefree-studio/shared"

interface FormatInput {
  analysisId: string
  query: string
  parsedParams: ParsedParams
  competitors: Competitor[]
  insights: ReviewInsights
  concept: GameConcept
  searchReason?: string
  totalReviews: number
  llmCallCount: number
  startTimeMs: number
}

export class FormatNode extends BaseNode<FormatInput, GentityReport> {
  readonly nodeId = "format"

  constructor(emitter: NodeEventEmitter, graphId: string) {
    super(emitter, graphId)
  }

  protected async process(input: FormatInput): Promise<GentityReport> {
    this.emitProgress("리포트를 작성하고 있어요", 50)

    return {
      analysisId: input.analysisId,
      query: input.query,
      parsedParams: input.parsedParams,
      competitors: input.competitors,
      insights: input.insights,
      concept: input.concept,
      searchReason: input.searchReason,
      meta: {
        totalReviewsAnalyzed: input.totalReviews,
        llmCallCount: input.llmCallCount,
        executionTimeMs: Date.now() - input.startTimeMs,
      },
    }
  }

  protected buildSummary(): NodeCompleteSummary {
    return { kind: "create", conceptTitle: "report" }
  }
}
