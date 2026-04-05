// packages/scraper-adapters/src/__tests__/google-play.adapter.test.ts

import { describe, it, expect } from "vitest"
import { searchGooglePlay, fetchGooglePlayReviews } from "../google-play.adapter.js"

describe("Google Play Adapter", () => {
  it("키워드로 앱을 검색하면 Competitor 배열을 반환한다", async () => {
    const results = await searchGooglePlay("idle restaurant", 5)

    expect(results.length).toBeGreaterThan(0)
    expect(results.length).toBeLessThanOrEqual(5)

    const first = results[0]
    expect(first.platform).toBe("google_play")
    expect(first.appId).toBeTruthy()
    expect(first.title).toBeTruthy()
    expect(typeof first.score).toBe("number")
  }, 30000)

  it("appId로 리뷰를 수집하면 en+ko AppReview 배열을 반환한다", async () => {
    const apps = await searchGooglePlay("idle restaurant", 1)
    const reviews = await fetchGooglePlayReviews(apps[0].appId, 10)

    expect(reviews.length).toBeGreaterThan(0)

    const first = reviews[0]
    expect(first.platform).toBe("google_play")
    expect(first.text).toBeTruthy()
    expect([1, 2, 3, 4, 5]).toContain(first.score)
  }, 30000)
})
