// packages/scraper-adapters/src/__tests__/app-store.adapter.test.ts

import { describe, it, expect } from "vitest"
import { searchAppStore, fetchAppStoreReviews } from "../app-store.adapter.js"

describe("App Store Adapter", () => {
  it("키워드로 앱을 검색하면 Competitor 배열을 반환한다", async () => {
    const results = await searchAppStore("idle restaurant", 5)

    expect(results.length).toBeGreaterThan(0)
    expect(results.length).toBeLessThanOrEqual(5)

    const first = results[0]
    expect(first.platform).toBe("app_store")
    expect(first.appId).toBeTruthy()
    expect(first.title).toBeTruthy()
  }, 30000)

  it("appId로 리뷰를 수집하면 US+KR AppReview 배열을 반환한다", async () => {
    const apps = await searchAppStore("idle restaurant", 1)
    const reviews = await fetchAppStoreReviews(apps[0].appId, 10)

    // 리뷰가 없을 수도 있으므로 배열인지만 확인
    expect(Array.isArray(reviews)).toBe(true)
  }, 30000)
})
