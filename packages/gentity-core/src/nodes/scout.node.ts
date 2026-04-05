// packages/gentity-core/src/nodes/scout.node.ts

import { BaseNode } from "./base.node.js"
import type {
  NodeCompleteSummary,
  NodeProgressDetail,
  NodeEventEmitter,
} from "@carefree-studio/shared"
import type { ParsedParams, Competitor, AppReview } from "@carefree-studio/shared"
import type { SearchLocale } from "@carefree-studio/scraper-adapters"

interface ScoutResult {
  competitors: Competitor[]
  reviews: AppReview[]
}

export interface ScoutDeps {
  searchGooglePlay: (keyword: string, limit: number, locale?: SearchLocale) => Promise<Competitor[]>
  searchAppStore: (keyword: string, limit: number, locale?: SearchLocale) => Promise<Competitor[]>
  fetchGooglePlayReviews: (appId: string, limit: number) => Promise<AppReview[]>
  fetchAppStoreReviews: (appId: string, limit: number) => Promise<AppReview[]>
}

/**
 * 제목 정규화: 특수문자 제거, 공백 정규화, 소문자 변환
 */
function normalizeTitle(title: string): string {
  return title
    .replace(/[^\w\s\uAC00-\uD7AF\u3040-\u30FF\u4E00-\u9FFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
}

export class ScoutNode extends BaseNode<
  {
    params: ParsedParams
    maxCompetitors: number
    reviewsPerApp: number
    existingCompetitors?: Competitor[]
    existingReviews?: AppReview[]
  },
  ScoutResult,
  Extract<NodeProgressDetail, { kind: "scraping" }>
> {
  readonly nodeId = "scout"

  constructor(
    emitter: NodeEventEmitter,
    graphId: string,
    private readonly deps: ScoutDeps
  ) {
    super(emitter, graphId)
  }

  protected async process(input: {
    params: ParsedParams
    maxCompetitors: number
    reviewsPerApp: number
    existingCompetitors?: Competitor[]
    existingReviews?: AppReview[]
  }): Promise<ScoutResult> {
    const { params, maxCompetitors, reviewsPerApp } = input
    const existingAppIds = new Set((input.existingCompetitors ?? []).map((c) => c.appId))

    // English keywords → US store
    const enSearches = params.keywords.map(async (keyword) => {
      this.emitProgress(`"${keyword}" 관련 게임을 찾고 있어요`, 10, {
        kind: "scraping",
        appTitle: keyword,
        current: 0,
        total: params.keywords.length + (params.keywordsKo?.length ?? 0),
      })

      const [gpResults, asResults] = await Promise.all([
        this.deps.searchGooglePlay(keyword, maxCompetitors, { lang: "en", country: "us" }),
        this.deps.searchAppStore(keyword, maxCompetitors, { lang: "en", country: "us" }),
      ])
      return [...gpResults, ...asResults]
    })

    // Korean keywords → KR store
    const koSearches = (params.keywordsKo ?? []).map(async (keyword) => {
      this.emitProgress(`"${keyword}" 관련 게임을 찾고 있어요`, 10, {
        kind: "scraping",
        appTitle: keyword,
        current: 0,
        total: params.keywords.length + (params.keywordsKo?.length ?? 0),
      })

      const [gpResults, asResults] = await Promise.all([
        this.deps.searchGooglePlay(keyword, maxCompetitors, { lang: "ko", country: "kr" }),
        this.deps.searchAppStore(keyword, maxCompetitors, { lang: "ko", country: "kr" }),
      ])
      return [...gpResults, ...asResults]
    })

    // Run all searches in parallel
    const searchResults = await Promise.all([...enSearches, ...koSearches])
    const freshCompetitors: Competitor[] = searchResults.flat()

    // 기존 + 신규 합치고 중복 제거 (appId 우선, 제목 정규화 보조)
    const existing = input.existingCompetitors ?? []
    const merged = [...existing, ...freshCompetitors]
    const seenAppIds = new Set<string>()
    const seenTitles = new Set<string>()
    const uniqueCompetitors = merged
      .filter((c) => {
        if (seenAppIds.has(c.appId)) return false
        seenAppIds.add(c.appId)
        const key = normalizeTitle(c.title)
        if (seenTitles.has(key)) return false
        seenTitles.add(key)
        return true
      })
      .slice(0, maxCompetitors)

    // 리뷰 수집 — 이미 수집된 앱은 건너뛰기
    const newCompetitors = uniqueCompetitors.filter((c) => !existingAppIds.has(c.appId))
    const CONCURRENCY = 3
    const allReviews: AppReview[] = [...(input.existingReviews ?? [])]
    let completed = 0

    const reviewTasks = newCompetitors.map((comp) => async () => {
      const fetchFn =
        comp.platform === "google_play"
          ? this.deps.fetchGooglePlayReviews
          : this.deps.fetchAppStoreReviews

      const reviews = await fetchFn(comp.appId, reviewsPerApp)
      completed++
      const progress =
        newCompetitors.length > 0 ? 30 + (completed / newCompetitors.length) * 60 : 90

      this.emitProgress(
        `${comp.title} 리뷰를 수집하고 있어요 (${completed}/${newCompetitors.length})`,
        progress,
        {
          kind: "scraping",
          appTitle: comp.title,
          current: completed,
          total: newCompetitors.length,
        }
      )

      return reviews
    })

    // 동시성 제한 3으로 Promise.allSettled 실행
    const chunks: (() => Promise<AppReview[]>)[][] = []
    for (let i = 0; i < reviewTasks.length; i += CONCURRENCY) {
      chunks.push(reviewTasks.slice(i, i + CONCURRENCY))
    }

    for (const chunk of chunks) {
      const results = await Promise.allSettled(chunk.map((task) => task()))
      for (const result of results) {
        if (result.status === "fulfilled") {
          allReviews.push(...result.value)
        }
      }
    }

    return { competitors: uniqueCompetitors, reviews: allReviews }
  }

  protected buildSummary(result: ScoutResult): NodeCompleteSummary {
    const platforms = [...new Set(result.competitors.map((c) => c.platform))]
    return {
      kind: "scout",
      competitorCount: result.competitors.length,
      reviewCount: result.reviews.length,
      platforms,
    }
  }
}
