// packages/gentity-core/src/__tests__/format.node.test.ts

import { describe, it, expect } from "vitest"
import { FormatNode } from "../nodes/format.node.js"
import { createNoopEmitter } from "../events/emitter.js"

const emitter = createNoopEmitter()

const baseInput = {
  analysisId: "test-uuid-1234",
  query: "idle game",
  parsedParams: {
    keywords: ["idle", "game"],
    keywordsKo: ["방치형", "게임"],
    genre: "casual" as const,
    mechanics: [],
  },
  competitors: [],
  insights: { topStrengths: [], topPainPoints: [], unmetNeeds: [], trendPatterns: [] },
  concept: {
    title: "Test Game",
    coreLoop: "tap and earn",
    mechanics: ["idle", "upgrade"],
    targetUser: "casual gamers",
    differentiation: "unique art",
    monetization: "ads",
    cpiTestPlan: "test plan",
    markdown: "# Test Game",
  },
  totalReviews: 100,
  llmCallCount: 3,
  startTimeMs: Date.now() - 5000,
}

describe("FormatNode", () => {
  it("입력받은 analysisId를 report에 그대로 반환한다", async () => {
    const node = new FormatNode(emitter, "gentity")
    const report = await node.execute(baseInput)
    expect(report.analysisId).toBe("test-uuid-1234")
  })

  it("입력받은 query를 report에 그대로 반환한다", async () => {
    const node = new FormatNode(emitter, "gentity")
    const report = await node.execute(baseInput)
    expect(report.query).toBe("idle game")
  })

  it("meta.totalReviewsAnalyzed가 totalReviews와 일치한다", async () => {
    const node = new FormatNode(emitter, "gentity")
    const report = await node.execute(baseInput)
    expect(report.meta.totalReviewsAnalyzed).toBe(100)
  })

  it("meta.llmCallCount가 llmCallCount와 일치한다", async () => {
    const node = new FormatNode(emitter, "gentity")
    const report = await node.execute(baseInput)
    expect(report.meta.llmCallCount).toBe(3)
  })

  it("meta.executionTimeMs가 0보다 크다", async () => {
    const node = new FormatNode(emitter, "gentity")
    const report = await node.execute(baseInput)
    expect(report.meta.executionTimeMs).toBeGreaterThan(0)
  })

  it("다른 analysisId로 실행하면 다른 report.analysisId를 반환한다", async () => {
    const node = new FormatNode(emitter, "gentity")
    const report1 = await node.execute({ ...baseInput, analysisId: "uuid-aaa" })
    const report2 = await node.execute({ ...baseInput, analysisId: "uuid-bbb" })
    expect(report1.analysisId).toBe("uuid-aaa")
    expect(report2.analysisId).toBe("uuid-bbb")
    expect(report1.analysisId).not.toBe(report2.analysisId)
  })
})
