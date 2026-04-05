// packages/gentity-core/src/graph.ts

import { StateGraph, Annotation, START, END } from "@langchain/langgraph"
import type {
  NodeEventEmitter,
  AnalyzeRequest,
  ParsedParams,
  Competitor,
  AppReview,
  ReviewInsights,
  GameConcept,
  VerificationResult,
  GentityReport,
  LlmConfig,
} from "@carefree-studio/shared"
import { DEFAULT_LLM_CONFIG } from "@carefree-studio/shared"
import { ParseNode } from "./nodes/parse.node.js"
import { ScoutNode } from "./nodes/scout.node.js"
import type { ScoutDeps } from "./nodes/scout.node.js"
import { AnalyzeNode } from "./nodes/analyze.node.js"
import { CreateNode } from "./nodes/create.node.js"
import { VerifyNode } from "./nodes/verify.node.js"
import { FormatNode } from "./nodes/format.node.js"
import { ValidateSearchNode } from "./nodes/validate-search.node.js"
import type { SearchValidation } from "./nodes/validate-search.node.js"

const GentityAnnotation = Annotation.Root({
  // Input
  request: Annotation<AnalyzeRequest>,
  analysisId: Annotation<string>,
  // PARSE
  parsedParams: Annotation<ParsedParams>,
  // SCOUT
  competitors: Annotation<Competitor[]>,
  reviews: Annotation<AppReview[]>,
  searchRetryCount: Annotation<number>,
  searchValidation: Annotation<SearchValidation>,
  // ANALYZE
  insights: Annotation<ReviewInsights>,
  // CREATE
  concept: Annotation<GameConcept>,
  previousFeedback: Annotation<string>,
  // VERIFY
  verification: Annotation<VerificationResult>,
  // FORMAT
  report: Annotation<GentityReport>,
  // Meta
  llmCallCount: Annotation<number>,
  startTimeMs: Annotation<number>,
})

type GentityState = typeof GentityAnnotation.State

export function buildGentityGraph(
  emitter: NodeEventEmitter,
  scoutDeps: ScoutDeps,
  llmConfig: LlmConfig = DEFAULT_LLM_CONFIG
) {
  const parseNode = new ParseNode(emitter, "gentity", llmConfig)
  const scoutNode = new ScoutNode(emitter, "gentity", scoutDeps)
  const analyzeNode = new AnalyzeNode(emitter, "gentity", llmConfig)
  const createNode = new CreateNode(emitter, "gentity", llmConfig)
  const verifyNode = new VerifyNode(emitter, "gentity", llmConfig)
  const formatNode = new FormatNode(emitter, "gentity")
  const validateSearchNode = new ValidateSearchNode(emitter, "gentity", llmConfig)

  const graph = new StateGraph(GentityAnnotation)
    .addNode("parse", async (state: GentityState) => {
      const result = await parseNode.execute(state.request.query)
      return { parsedParams: result, llmCallCount: (state.llmCallCount ?? 0) + 1 }
    })
    .addNode("scout", async (state: GentityState) => {
      const result = await scoutNode.execute({
        params: state.parsedParams,
        maxCompetitors: state.request.maxCompetitors ?? 15,
        reviewsPerApp: state.request.reviewsPerApp ?? 200,
        existingCompetitors: state.competitors,
        existingReviews: state.reviews,
      })
      return { competitors: result.competitors, reviews: result.reviews }
    })
    .addNode("validate-search", async (state: GentityState) => {
      const result = await validateSearchNode.execute({
        originalQuery: state.request.query,
        competitors: state.competitors,
        parsedParams: state.parsedParams,
      })
      return {
        searchValidation: result,
        llmCallCount: (state.llmCallCount ?? 0) + 1,
        // If failed, update parsedParams with new keywords for re-search
        ...(result.passed
          ? {}
          : {
              parsedParams: {
                ...state.parsedParams,
                keywords: result.newKeywords ?? state.parsedParams.keywords,
                keywordsKo: result.newKeywordsKo ?? state.parsedParams.keywordsKo,
              },
              searchRetryCount: (state.searchRetryCount ?? 0) + 1,
            }),
      }
    })
    .addNode("analyze", async (state: GentityState) => {
      const result = await analyzeNode.execute({
        reviews: state.reviews,
        competitors: state.competitors,
        reviewsPerApp: state.request.reviewsPerApp ?? 200,
      })
      return { insights: result, llmCallCount: (state.llmCallCount ?? 0) + 1 }
    })
    .addNode("create", async (state: GentityState) => {
      const result = await createNode.execute({
        originalQuery: state.request.query,
        params: state.parsedParams,
        competitors: state.competitors,
        insights: state.insights,
        previousFeedback: state.previousFeedback,
      })
      return { concept: result, llmCallCount: (state.llmCallCount ?? 0) + 1 }
    })
    .addNode("verify", async (state: GentityState) => {
      const retryCount = state.verification?.retryCount ?? 0
      const result = await verifyNode.execute({
        concept: state.concept,
        insights: state.insights,
        retryCount,
      })
      return {
        verification: { ...result, retryCount: retryCount + 1 },
        llmCallCount: (state.llmCallCount ?? 0) + 1,
        previousFeedback: result.passed ? state.previousFeedback : result.feedback,
      }
    })
    .addNode("format", async (state: GentityState) => {
      const result = await formatNode.execute({
        analysisId: state.analysisId,
        query: state.request.query,
        parsedParams: state.parsedParams,
        competitors: state.competitors,
        insights: state.insights,
        concept: state.concept,
        searchReason: state.searchValidation?.reason,
        totalReviews: state.reviews.length,
        llmCallCount: state.llmCallCount ?? 0,
        startTimeMs: state.startTimeMs,
      })
      return { report: result }
    })
    .addEdge(START, "parse")
    .addEdge("parse", "scout")
    .addEdge("scout", "validate-search")
    .addConditionalEdges("validate-search", (state: GentityState) => {
      if (state.searchValidation.passed || (state.searchRetryCount ?? 0) >= 2) {
        return "analyze"
      }
      return "scout"
    })
    .addEdge("analyze", "create")
    .addEdge("create", "verify")
    .addConditionalEdges("verify", (state: GentityState) => {
      if (state.verification.passed || state.verification.retryCount >= 2) {
        return "format"
      }
      return "create"
    })
    .addEdge("format", END)

  return graph.compile()
}
