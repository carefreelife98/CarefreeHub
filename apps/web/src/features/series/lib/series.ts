import { posts, series } from "#site/content"

export type Series = (typeof series)[number]
export type SeriesPost = (typeof posts)[number]

/** 시리즈 목록 (order 오름차순, 미지정은 뒤로) */
export function getAllSeries() {
  return [...series].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
}

export function getSeriesBySlug(slug: string) {
  return series.find((sr) => sr.slug === slug) ?? null
}

/** 시리즈에 속한 발행 포스트 (회차 오름차순) */
export function getSeriesPosts(seriesSlug: string) {
  return posts
    .filter((post) => post.published && post.series === seriesSlug)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0))
}

/** 포스트 상세용 시리즈 내비게이션 데이터 (시리즈 미소속이면 null) */
export function getSeriesNavData(post: SeriesPost) {
  if (!post.series) return null
  const sr = getSeriesBySlug(post.series)
  if (!sr) return null

  const items = getSeriesPosts(post.series).map((p) => ({
    slug: p.slug,
    title: p.title,
    order: p.seriesOrder ?? 0,
  }))
  const index = items.findIndex((item) => item.slug === post.slug)
  if (index === -1) return null

  return {
    slug: sr.slug,
    title: sr.title,
    items,
    current: index,
    prev: index > 0 ? items[index - 1] : null,
    next: index < items.length - 1 ? items[index + 1] : null,
  }
}

export type SeriesNavData = NonNullable<ReturnType<typeof getSeriesNavData>>
