// packages/gentity-core/src/index.ts

import type {
  AnalyzeRequest,
  GentityReport,
  NodeEventEmitter,
  Competitor,
  AppReview,
} from "@carefree-studio/shared"
import { DEFAULT_LLM_CONFIG } from "@carefree-studio/shared"
import { buildGentityGraph } from "./graph.js"
import { createNoopEmitter } from "./events/emitter.js"
import { logger } from "./logger.js"

export { buildGentityGraph } from "./graph.js"
export { BaseNode } from "./nodes/base.node.js"
export { createNoopEmitter, createCollectingEmitter } from "./events/emitter.js"
export { createLlmModel } from "./llm/factory.js"
export { logger, logHttp, logHttpResponse } from "./logger.js"
export { MARKDOWN_GUIDE, MERMAID_GUIDE } from "./prompts/markdown-guide.js"
export { withRetry } from "./retry.js"

interface AnalyzeDeps {
  searchGooglePlay: (keyword: string, limit: number) => Promise<Competitor[]>
  searchAppStore: (keyword: string, limit: number) => Promise<Competitor[]>
  fetchGooglePlayReviews: (appId: string, limit: number) => Promise<AppReview[]>
  fetchAppStoreReviews: (appId: string, limit: number) => Promise<AppReview[]>
}

export async function analyze(
  request: AnalyzeRequest,
  deps: AnalyzeDeps,
  emitter: NodeEventEmitter = createNoopEmitter(),
  analysisId: string = crypto.randomUUID()
): Promise<GentityReport> {
  const llmConfig = request.llm ?? DEFAULT_LLM_CONFIG
  logger.info("gentity", `▶ Pipeline START`, {
    analysisId,
    query: request.query,
    provider: llmConfig.provider,
    model: llmConfig.model,
    maxCompetitors: request.maxCompetitors ?? 15,
    reviewsPerApp: request.reviewsPerApp ?? 200,
  })

  const startMs = Date.now()
  const graph = buildGentityGraph(emitter, deps, llmConfig)

  try {
    const result = await graph.invoke({
      request,
      analysisId,
      startTimeMs: startMs,
      llmCallCount: 0,
    })

    const durationMs = Date.now() - startMs
    logger.info("gentity", `✔ Pipeline END`, {
      analysisId,
      durationMs,
      competitors: result.report.competitors.length,
      reviews: result.report.meta.totalReviewsAnalyzed,
      llmCalls: result.report.meta.llmCallCount,
      conceptTitle: result.report.concept.title,
    })

    return result.report
  } catch (error) {
    const durationMs = Date.now() - startMs
    logger.error("gentity", `✘ Pipeline FAIL`, {
      analysisId,
      durationMs,
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}
