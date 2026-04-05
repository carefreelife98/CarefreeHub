// packages/gentity-core/src/__tests__/graph.test.ts

import { describe, it, expect } from "vitest"
import { analyze, createCollectingEmitter } from "../index.js"
import type { Competitor, AppReview } from "@carefree-studio/shared"

const mockCompetitor: Competitor = {
  appId: "com.test.game",
  platform: "google_play",
  title: "Test Game",
  score: 4.2,
  ratings: 10000,
  installs: "1M+",
  genre: "Casual",
  description: "A test game",
  iconUrl: "https://example.com/icon.png",
}

const mockReview: AppReview = {
  reviewId: "review-1",
  competitorAppId: "com.test.game",
  platform: "google_play",
  text: "Great game but too many ads. Would love more customization options.",
  score: 3,
  thumbsUp: 5,
  createdAt: new Date(),
}

const mockDeps = {
  searchGooglePlay: async () => [mockCompetitor],
  searchAppStore: async () => [],
  fetchGooglePlayReviews: async () => Array(10).fill(mockReview),
  fetchAppStoreReviews: async () => [],
}

describe("Gentity Graph (통합)", () => {
  it("analyze()는 GentityReport를 반환한다", async () => {
    const { emitter, events } = createCollectingEmitter()

    const report = await analyze(
      { query: "idle restaurant", maxCompetitors: 3, reviewsPerApp: 10 },
      mockDeps,
      emitter
    )

    // 리포트 구조 확인
    expect(report.query).toBe("idle restaurant")
    expect(report.parsedParams).toBeDefined()
    expect(report.parsedParams.keywords.length).toBeGreaterThan(0)
    expect(report.competitors.length).toBeGreaterThan(0)
    expect(report.insights.topStrengths).toBeDefined()
    expect(report.concept.title).toBeTruthy()
    expect(report.meta.llmCallCount).toBeGreaterThanOrEqual(3)

    // 이벤트 발행 확인 — 최소 6개 노드 × start/complete = 12개
    const startEvents = events.filter((e) => e.type === "node:start")
    const completeEvents = events.filter((e) => e.type === "node:complete")
    expect(startEvents.length).toBeGreaterThanOrEqual(6)
    expect(completeEvents.length).toBeGreaterThanOrEqual(6)

    // 모든 이벤트의 graphId가 gentity
    expect(events.every((e) => e.graphId === "gentity")).toBe(true)
  }, 120000)
})
