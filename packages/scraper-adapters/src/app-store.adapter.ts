// packages/scraper-adapters/src/app-store.adapter.ts

import type { Competitor, AppReview } from "@carefree-studio/shared"
import type { SearchLocale } from "./types.js"

interface ITunesResult {
  trackId: number
  trackName: string
  averageUserRating: number
  userRatingCount: number
  primaryGenreName: string
  genres: string[]
  description: string
  artworkUrl100: string
}

export async function searchAppStore(
  keyword: string,
  limit: number = 15,
  locale: SearchLocale = { lang: "en", country: "us" }
): Promise<Competitor[]> {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(keyword)}&entity=software&genreId=6014&limit=${limit}&country=${locale.country}`
  const response = await fetch(url)
  const data = (await response.json()) as { results: ITunesResult[] }

  return data.results.map(
    (app): Competitor => ({
      appId: String(app.trackId),
      platform: "app_store",
      title: app.trackName,
      score: app.averageUserRating ?? 0,
      ratings: app.userRatingCount ?? 0,
      installs: "",
      genre: (app.genres?.find((g) => g !== "Games") ?? app.primaryGenreName) || "",
      description: app.description ?? "",
      iconUrl: app.artworkUrl100 ?? "",
    })
  )
}

export async function getTopAppStoreGames(
  limit: number = 20,
  country: string = "kr"
): Promise<{ title: string; genre: string; score: number }[]> {
  const url = `https://itunes.apple.com/${country}/rss/topfreeapplications/genre=6014/limit=${limit}/json`
  const res = await fetch(url)
  const data = (await res.json()) as {
    feed?: {
      entry?: {
        "im:name": { label: string }
        "im:rating"?: { label: string }
        category?: { attributes?: { label: string } }
      }[]
    }
  }

  const entries = data?.feed?.entry ?? []
  return entries.map((e) => ({
    title: e["im:name"].label,
    genre: e.category?.attributes?.label ?? "",
    score: 0, // RSS에 평점 없음
  }))
}

// Apple RSS JSON feed로 리뷰 직접 수집 (외부 의존성 없이 fetch만 사용)
interface RSSEntry {
  id: { label: string }
  title: { label: string }
  content: { label: string }
  "im:rating": { label: string }
  updated: { label: string }
  author: { name: { label: string } }
}

async function fetchRSSReviews(
  appId: string,
  country: string,
  pages: number = 3
): Promise<AppReview[]> {
  const reviews: AppReview[] = []

  for (let page = 1; page <= pages; page++) {
    try {
      const url = `https://itunes.apple.com/${country}/rss/customerreviews/page=${page}/id=${appId}/sortby=mostrecent/json`
      const res = await fetch(url)
      if (!res.ok) continue
      const data = (await res.json()) as { feed?: { entry?: RSSEntry[] } }
      const entries = data?.feed?.entry
      if (!Array.isArray(entries)) continue

      for (const entry of entries) {
        if (!entry.content?.label) continue
        reviews.push({
          reviewId: entry.id?.label ?? crypto.randomUUID(),
          competitorAppId: appId,
          platform: "app_store",
          text: entry.content.label,
          score: Math.min(5, Math.max(1, parseInt(entry["im:rating"]?.label ?? "3", 10))) as
            | 1
            | 2
            | 3
            | 4
            | 5,
          thumbsUp: 0,
          createdAt: entry.updated?.label ? new Date(entry.updated.label) : new Date(),
        })
      }
    } catch {
      continue
    }
  }

  return reviews
}

export async function fetchAppStoreReviews(
  appId: string,
  limit: number = 200
): Promise<AppReview[]> {
  const pagesPerLocale = Math.max(1, Math.ceil(limit / 2 / 50))

  const [usReviews, krReviews] = await Promise.allSettled([
    fetchRSSReviews(appId, "us", pagesPerLocale),
    fetchRSSReviews(appId, "kr", pagesPerLocale),
  ])

  const allReviews: AppReview[] = []
  if (usReviews.status === "fulfilled") allReviews.push(...usReviews.value)
  if (krReviews.status === "fulfilled") allReviews.push(...krReviews.value)

  const seen = new Set<string>()
  return allReviews
    .filter((r) => {
      if (seen.has(r.reviewId)) return false
      seen.add(r.reviewId)
      return true
    })
    .slice(0, limit)
}
