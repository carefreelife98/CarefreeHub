// packages/scraper-adapters/src/google-play.adapter.ts

import gplay from "google-play-scraper"
import type { Competitor, AppReview } from "@carefree-studio/shared"
import type { SearchLocale } from "./types.js"

export async function searchGooglePlay(
  keyword: string,
  limit: number = 15,
  locale: SearchLocale = { lang: "en", country: "us" }
): Promise<Competitor[]> {
  const results = await gplay.search({
    term: keyword,
    num: limit,
    lang: locale.lang,
    country: locale.country,
  })

  // search()는 genre/installs/ratings를 반환하지 않으므로 app()으로 상세 조회
  const details = await Promise.allSettled(
    results.map((app) =>
      gplay.app({ appId: app.appId, lang: locale.lang, country: locale.country })
    )
  )

  return results.map((app, i): Competitor => {
    const detail = details[i].status === "fulfilled" ? details[i].value : null
    return {
      appId: app.appId,
      platform: "google_play",
      title: app.title,
      score: detail?.score ?? app.score ?? 0,
      ratings: detail?.ratings ?? 0,
      installs: detail?.installs ?? "",
      genre: detail?.genre ?? "",
      description: detail?.summary ?? app.summary ?? "",
      iconUrl: app.icon ?? "",
    }
  })
}

export async function getTopGooglePlayGames(
  limit: number = 20,
  country: string = "kr"
): Promise<{ title: string; genre: string; score: number }[]> {
  const results = await gplay.list({
    collection: gplay.collection.TOP_FREE,
    category: gplay.category.GAME,
    num: limit,
    country,
  })

  // list()도 search()와 마찬가지로 genre 미포함 — app()으로 보강
  const details = await Promise.allSettled(
    results.slice(0, limit).map((app) => gplay.app({ appId: app.appId, country }))
  )

  return results.slice(0, limit).map((app, i) => {
    const detail = details[i]?.status === "fulfilled" ? details[i].value : null
    return {
      title: app.title,
      genre: detail?.genre ?? "",
      score: detail?.score ?? app.score ?? 0,
    }
  })
}

export async function fetchGooglePlayReviews(
  appId: string,
  limit: number = 200
): Promise<AppReview[]> {
  const [enResult, koResult] = await Promise.all([
    gplay.reviews({
      appId,
      num: Math.ceil(limit / 2),
      sort: gplay.sort.NEWEST,
      lang: "en",
      country: "us",
    }),
    gplay.reviews({
      appId,
      num: Math.ceil(limit / 2),
      sort: gplay.sort.NEWEST,
      lang: "ko",
      country: "kr",
    }),
  ])

  const mapReview = (review: (typeof enResult.data)[number]): AppReview => ({
    reviewId: review.id ?? crypto.randomUUID(),
    competitorAppId: appId,
    platform: "google_play",
    text: review.text ?? "",
    score: (review.score ?? 3) as 1 | 2 | 3 | 4 | 5,
    thumbsUp: review.thumbsUp ?? 0,
    createdAt: review.date ? new Date(review.date) : new Date(),
  })

  const allReviews = [...enResult.data.map(mapReview), ...koResult.data.map(mapReview)]

  const seen = new Set<string>()
  return allReviews
    .filter((r) => {
      if (seen.has(r.reviewId)) return false
      seen.add(r.reviewId)
      return true
    })
    .slice(0, limit)
}
