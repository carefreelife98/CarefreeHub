import { posts } from "#site/content"
import { findCategoryBySlug, getCategoryColor } from "@shared/config"
import type {
  BlogRecapStats,
  CategoryBreakdown,
  MonthlyActivity,
  TagStat,
  PostHighlight,
} from "../../model/types"

const MONTH_NAMES = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
]

/**
 * 연도별 블로그 Recap 통계 계산
 */
export function getBlogRecapStats(year: number): BlogRecapStats {
  // 해당 연도 포스트 필터링
  const yearPosts = posts
    .filter((post) => post.published)
    .filter((post) => new Date(post.date).getFullYear() === year)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (yearPosts.length === 0) {
    return createEmptyStats(year)
  }

  // 총계 계산
  const totalPosts = yearPosts.length
  const totalWords = yearPosts.reduce((sum, post) => {
    const wordCount = post.body?.split(/\s+/).length ?? 0
    return sum + wordCount
  }, 0)
  const avgReadingTime = Math.ceil(totalWords / 200) // 분당 200단어 기준

  // 카테고리 분포
  const categoryBreakdown = calculateCategoryBreakdown(yearPosts)

  // 월별 활동
  const monthlyActivity = calculateMonthlyActivity(yearPosts, year)

  // 태그 통계
  const topTags = calculateTopTags(yearPosts)

  // 하이라이트
  const highlights = calculateHighlights(yearPosts)

  return {
    year,
    totalPosts,
    totalWords,
    totalReadingTime: avgReadingTime,
    categoryBreakdown,
    monthlyActivity,
    topTags,
    highlights,
  }
}

function createEmptyStats(year: number): BlogRecapStats {
  return {
    year,
    totalPosts: 0,
    totalWords: 0,
    totalReadingTime: 0,
    categoryBreakdown: [],
    monthlyActivity: MONTH_NAMES.map((name, i) => ({
      month: i + 1,
      monthName: name,
      postCount: 0,
    })),
    topTags: [],
    highlights: {},
  }
}

function calculateCategoryBreakdown(yearPosts: typeof posts): CategoryBreakdown[] {
  const categoryCount = new Map<string, number>()

  for (const post of yearPosts) {
    for (const cat of post.categories) {
      categoryCount.set(cat, (categoryCount.get(cat) ?? 0) + 1)
    }
  }

  const total = yearPosts.length
  const breakdown: CategoryBreakdown[] = []

  for (const [slug, count] of categoryCount) {
    const category = findCategoryBySlug(slug)
    breakdown.push({
      category: category?.name ?? slug,
      slug,
      count,
      percentage: Math.round((count / total) * 100),
      color: getCategoryColor(slug),
    })
  }

  return breakdown.sort((a, b) => b.count - a.count).slice(0, 6)
}

function calculateMonthlyActivity(yearPosts: typeof posts, year: number): MonthlyActivity[] {
  const monthCounts = new Array(12).fill(0)

  for (const post of yearPosts) {
    const month = new Date(post.date).getMonth()
    monthCounts[month]++
  }

  return monthCounts.map((count, i) => ({
    month: i + 1,
    monthName: MONTH_NAMES[i],
    postCount: count,
  }))
}

function calculateTopTags(yearPosts: typeof posts): TagStat[] {
  const tagCount = new Map<string, number>()

  for (const post of yearPosts) {
    for (const tag of post.tags) {
      tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1)
    }
  }

  const stats: TagStat[] = []
  for (const [tag, count] of tagCount) {
    stats.push({ tag, count })
  }

  return stats.sort((a, b) => b.count - a.count).slice(0, 10)
}

function calculateHighlights(yearPosts: typeof posts): BlogRecapStats["highlights"] {
  if (yearPosts.length === 0) return {}

  const toHighlight = (post: (typeof posts)[0]): PostHighlight => ({
    title: post.title,
    slug: post.slug,
    date: post.date,
    description: post.description,
    category: post.categories[0],
    wordCount: post.body?.split(/\s+/).length ?? 0,
  })

  const sortedByDate = [...yearPosts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const sortedByWordCount = [...yearPosts].sort((a, b) => {
    const aWords = a.body?.split(/\s+/).length ?? 0
    const bWords = b.body?.split(/\s+/).length ?? 0
    return bWords - aWords
  })

  const sortedByTags = [...yearPosts].sort((a, b) => b.tags.length - a.tags.length)

  return {
    firstPost: toHighlight(sortedByDate[0]),
    latestPost: toHighlight(sortedByDate[sortedByDate.length - 1]),
    longestPost: toHighlight(sortedByWordCount[0]),
    mostTags: sortedByTags[0].tags.length > 0 ? toHighlight(sortedByTags[0]) : undefined,
  }
}

/**
 * 사용 가능한 Recap 연도 목록
 */
export function getAvailableRecapYears(): number[] {
  const years = new Set<number>()

  for (const post of posts) {
    if (post.published) {
      years.add(new Date(post.date).getFullYear())
    }
  }

  return Array.from(years).sort((a, b) => b - a)
}
