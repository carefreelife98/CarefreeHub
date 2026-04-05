// packages/gentity-core/src/nodes/analyze.node.ts

import { z } from "zod"
import { BaseNode } from "./base.node.js"
import { createLlmModel, type LlmModel } from "../llm/factory.js"
import { logger } from "../logger.js"
import type {
  NodeCompleteSummary,
  NodeProgressDetail,
  NodeEventEmitter,
  LlmConfig,
  AppReview,
  Competitor,
  ReviewInsights,
  ReviewSample,
} from "@carefree-studio/shared"

// ─── LLM Output Schema (청크 1개 기준) ────────────────────────────────────────
// 각 카테고리에 청크 내 상대 인덱스(0-based)만 반환.
// output 토큰을 최소화하기 위해 원문 텍스트는 포함하지 않는다.
const ChunkInsightsSchema = z.object({
  topStrengths: z
    .array(z.number().int().min(0))
    .describe("이 청크에서 게임의 강점을 언급한 리뷰의 인덱스 목록 (0-based). 강점 없으면 []"),
  topPainPoints: z
    .array(z.number().int().min(0))
    .describe("이 청크에서 불만/고통 지점을 언급한 리뷰의 인덱스 목록 (0-based). 없으면 []"),
  unmetNeeds: z
    .array(z.number().int().min(0))
    .describe(
      "이 청크에서 원하지만 충족되지 않은 기능/니즈를 언급한 리뷰의 인덱스 목록 (0-based). 없으면 []"
    ),
  trendPatterns: z
    .array(z.number().int().min(0))
    .describe(
      "이 청크에서 반복되는 트렌드나 패턴을 보이는 리뷰의 인덱스 목록 (0-based). 없으면 []"
    ),
})

type ChunkInsights = z.infer<typeof ChunkInsightsSchema>

// ─── 청크 결과 (chunkStart 포함) ──────────────────────────────────────────────
export interface ChunkResult extends ChunkInsights {
  chunkStart: number
}

// ─── 유틸리티 (export — 테스트에서 직접 검증) ─────────────────────────────────

/**
 * 배열을 chunkSize 단위로 분할한다.
 */
export function buildChunks<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize))
  }
  return chunks
}

/**
 * 청크별 LLM 결과를 받아 카테고리별 CategoryResult로 환산한다.
 * - 상대 인덱스를 절대 인덱스로 변환
 * - 중복 제거 (Set)
 * - mentionRate = 고유 절대 인덱스 수 / 전체 리뷰 수
 * - sampleReviews = thumbsUp 상위 3개 원문 text
 */
export function reduceChunkResults(
  chunkResults: ChunkResult[],
  allReviews: AppReview[],
  competitorTitleMap?: Map<string, string>
): ReviewInsights {
  const total = allReviews.length
  const categories = ["topStrengths", "topPainPoints", "unmetNeeds", "trendPatterns"] as const

  const makeCategory = (cat: (typeof categories)[number]): ReviewSample[] => {
    const absoluteIndices = new Set<number>()
    for (const chunk of chunkResults) {
      for (const relIdx of chunk[cat]) {
        const absIdx = chunk.chunkStart + relIdx
        if (absIdx < total) absoluteIndices.add(absIdx)
      }
    }
    return [...absoluteIndices]
      .map((idx) => allReviews[idx])
      .sort((a, b) => b.thumbsUp - a.thumbsUp)
      .map((r) => ({
        platform: r.platform,
        text: r.text,
        score: r.score,
        thumbsUp: r.thumbsUp,
        competitorTitle: competitorTitleMap?.get(r.competitorAppId),
      }))
  }

  return {
    topStrengths: makeCategory("topStrengths"),
    topPainPoints: makeCategory("topPainPoints"),
    unmetNeeds: makeCategory("unmetNeeds"),
    trendPatterns: makeCategory("trendPatterns"),
  }
}

// ─── AnalyzeNode ──────────────────────────────────────────────────────────────

const CHUNK_SIZE = 20

interface AnalyzeInput {
  reviews: AppReview[]
  competitors: Competitor[]
  reviewsPerApp: number
}

export class AnalyzeNode extends BaseNode<
  AnalyzeInput,
  ReviewInsights,
  Extract<NodeProgressDetail, { kind: "analyzing" }>
> {
  readonly nodeId = "analyze"

  private readonly model: LlmModel

  constructor(emitter: NodeEventEmitter, graphId: string, llmConfig: LlmConfig) {
    super(emitter, graphId)
    this.model = createLlmModel(llmConfig)
  }

  protected async process({
    reviews,
    competitors,
    reviewsPerApp,
  }: AnalyzeInput): Promise<ReviewInsights> {
    const competitorTitleMap = new Map<string, string>()
    for (const comp of competitors) {
      competitorTitleMap.set(comp.appId, comp.title)
    }

    const sampled = this.sampleReviews(reviews, reviewsPerApp)

    this.emitProgress(`유저 리뷰 ${sampled.length}건을 읽고 있어요`, 10, {
      kind: "analyzing",
      reviewCount: sampled.length,
    })

    const chunks = buildChunks(sampled, CHUNK_SIZE)
    const structured = this.model.withStructuredOutput(ChunkInsightsSchema)

    logger.info(
      `[node:analyze] ${chunks.length}개 청크 병렬 처리 시작 (청크당 최대 ${CHUNK_SIZE}개 리뷰)`
    )

    const chunkPromises = chunks.map(async (chunk, chunkIdx): Promise<ChunkResult> => {
      const chunkStart = chunkIdx * CHUNK_SIZE

      const reviewText = chunk
        .map((r, i) => {
          const gameTitle = competitorTitleMap.get(r.competitorAppId) ?? "Unknown"
          return `[R${String(i).padStart(3, "0")}][${gameTitle}] ${r.text}`
        })
        .join("\n")

      const raw = await structured.invoke([
        {
          role: "system",
          content: `You are a mobile game user review analyst.

Categorize the following reviews by returning ONLY the review index numbers (e.g. 0, 1, 2) for each category.
Do NOT return any text — only integer arrays.
You MUST return all four fields. If no reviews fit a category, return an empty array [].

Categories:
- topStrengths: reviews that praise the game's strengths
- topPainPoints: reviews that express pain points or complaints
- unmetNeeds: reviews that request features or express unmet needs
- trendPatterns: reviews that show recurring patterns or trends`,
        },
        { role: "user", content: reviewText },
      ])

      const chunkResult = { ...(raw as ChunkInsights), chunkStart }
      logger.debug(
        `[node:analyze] 청크 ${chunkIdx + 1}/${chunks.length} 완료 (start=${chunkStart})`
      )
      return chunkResult
    })

    const chunkResults = await Promise.all(chunkPromises)

    this.emitProgress(`리뷰 분석을 마무리하고 있어요`, 90, {
      kind: "analyzing",
      reviewCount: sampled.length,
    })

    return reduceChunkResults(chunkResults, sampled, competitorTitleMap)
  }

  private sampleReviews(reviews: AppReview[], maxCount: number): AppReview[] {
    if (reviews.length <= maxCount) return reviews

    const byScore = new Map<number, AppReview[]>()
    for (const review of reviews) {
      const group = byScore.get(review.score) ?? []
      group.push(review)
      byScore.set(review.score, group)
    }

    const perScore = Math.max(1, Math.floor(maxCount / 5))
    const sampled: AppReview[] = []

    for (let score = 1; score <= 5; score++) {
      const group = byScore.get(score) ?? []
      const shuffled = [...group].sort(() => Math.random() - 0.5)
      sampled.push(...shuffled.slice(0, perScore))
    }

    return sampled.slice(0, maxCount)
  }

  protected buildSummary(result: ReviewInsights): NodeCompleteSummary {
    return {
      kind: "analyze",
      strengthCount: result.topStrengths.length,
      painPointCount: result.topPainPoints.length,
    }
  }
}
