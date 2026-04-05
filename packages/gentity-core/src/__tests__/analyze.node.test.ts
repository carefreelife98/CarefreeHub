import { describe, it, expect } from "vitest"
import { buildChunks, reduceChunkResults } from "../nodes/analyze.node.js"
import type { AppReview } from "@carefree-studio/shared"

function makeReview(
  i: number,
  text: string,
  thumbsUp = 0,
  score: 1 | 2 | 3 | 4 | 5 = 3
): AppReview {
  return {
    reviewId: `r${i}`,
    competitorAppId: "com.test",
    platform: "google_play",
    text,
    score,
    thumbsUp,
    createdAt: new Date(),
  }
}

describe("buildChunks", () => {
  it("20개 단위로 청크를 나눈다", () => {
    const reviews = Array.from({ length: 45 }, (_, i) => makeReview(i, `review ${i}`))
    const chunks = buildChunks(reviews, 20)
    expect(chunks).toHaveLength(3)
    expect(chunks[0]).toHaveLength(20)
    expect(chunks[1]).toHaveLength(20)
    expect(chunks[2]).toHaveLength(5)
  })

  it("20개 이하면 청크 1개만 반환한다", () => {
    const reviews = Array.from({ length: 7 }, (_, i) => makeReview(i, `review ${i}`))
    const chunks = buildChunks(reviews, 20)
    expect(chunks).toHaveLength(1)
    expect(chunks[0]).toHaveLength(7)
  })

  it("빈 배열이면 빈 청크 배열을 반환한다", () => {
    expect(buildChunks([], 20)).toEqual([])
  })
})

describe("reduceChunkResults", () => {
  const reviews = Array.from({ length: 10 }, (_, i) => makeReview(i, `review text ${i}`, i * 2))

  it("여러 청크의 인덱스를 병합하여 ReviewSample[] 를 반환한다", () => {
    const chunkResults = [
      {
        chunkStart: 0,
        topStrengths: [0, 1, 2],
        topPainPoints: [],
        unmetNeeds: [],
        trendPatterns: [],
      },
      { chunkStart: 5, topStrengths: [0, 1], topPainPoints: [], unmetNeeds: [], trendPatterns: [] },
    ]
    const result = reduceChunkResults(chunkResults, reviews)
    // 절대 인덱스: 0,1,2,5,6 → 5개
    expect(result.topStrengths).toHaveLength(5)
    expect(result.topStrengths[0]).toMatchObject({
      text: expect.any(String),
      platform: "google_play",
    })
  })

  it("중복 인덱스는 1회만 포함된다", () => {
    const chunkResults = [
      { chunkStart: 0, topStrengths: [0], topPainPoints: [], unmetNeeds: [], trendPatterns: [] },
      { chunkStart: 0, topStrengths: [0], topPainPoints: [], unmetNeeds: [], trendPatterns: [] },
    ]
    const result = reduceChunkResults(chunkResults, reviews)
    expect(result.topStrengths).toHaveLength(1)
  })

  it("인덱스가 없으면 빈 배열을 반환한다", () => {
    const chunkResults = [
      { chunkStart: 0, topStrengths: [], topPainPoints: [], unmetNeeds: [], trendPatterns: [] },
    ]
    const result = reduceChunkResults(chunkResults, reviews)
    expect(result.topStrengths).toEqual([])
  })

  it("전체 리뷰가 빈 배열이면 빈 배열을 반환한다", () => {
    const result = reduceChunkResults([], [])
    expect(result.topStrengths).toEqual([])
  })

  it("범위를 벗어난 인덱스는 무시한다", () => {
    const chunkResults = [
      { chunkStart: 8, topStrengths: [0, 5], topPainPoints: [], unmetNeeds: [], trendPatterns: [] },
    ]
    const result = reduceChunkResults(chunkResults, reviews)
    // absIdx 8만 유효 (absIdx 13은 범위 초과)
    expect(result.topStrengths).toHaveLength(1)
    expect(result.topStrengths[0].text).toBe("review text 8")
  })

  it("결과는 thumbsUp 내림차순으로 정렬된다", () => {
    const chunkResults = [
      {
        chunkStart: 0,
        topStrengths: [0, 1, 2],
        topPainPoints: [],
        unmetNeeds: [],
        trendPatterns: [],
      },
    ]
    const result = reduceChunkResults(chunkResults, reviews)
    // thumbsUp: r0=0, r1=2, r2=4 → 내림차순: r2, r1, r0
    expect(result.topStrengths[0].text).toBe("review text 2")
    expect(result.topStrengths[1].text).toBe("review text 1")
    expect(result.topStrengths[2].text).toBe("review text 0")
  })
})
