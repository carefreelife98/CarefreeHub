import { posts } from "#site/content"

/**
 * 캐러셀에 표시할 피처드 포스트 가져오기
 * - featured 값이 있는 포스트 우선 (숫자 오름차순)
 * - 부족하면 최신 포스트로 보충
 */
export function getFeaturedPosts(limit = 5) {
  const featured = posts
    .filter((post) => post.published && post.featured != null)
    .sort((a, b) => a.featured! - b.featured!)
    .slice(0, limit)

  if (featured.length < limit) {
    const rest = posts
      .filter((p) => p.published && p.featured == null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit - featured.length)
    return [...featured, ...rest]
  }

  return featured
}

/**
 * 최신 포스트 가져오기
 */
export function getLatestPosts(limit = 8) {
  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

/**
 * 인기 포스트 가져오기 (현재는 최신순, 추후 조회수 기반으로 변경 가능)
 */
export function getHotPosts(limit = 3) {
  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

/**
 * 페이지네이션 설정
 */
export const POSTS_PER_PAGE = 10

/**
 * 전체 발행된 포스트 (최신순)
 */
export function getAllPublishedPosts() {
  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * 페이지네이션된 포스트 가져오기
 */
export function getPaginatedPosts(page: number, perPage = POSTS_PER_PAGE) {
  const allPosts = getAllPublishedPosts()
  const start = (page - 1) * perPage
  const end = start + perPage

  return {
    posts: allPosts.slice(start, end),
    totalPosts: allPosts.length,
    totalPages: Math.ceil(allPosts.length / perPage),
    currentPage: page,
    hasNextPage: end < allPosts.length,
    hasPrevPage: page > 1,
  }
}

/**
 * 전체 페이지 수 계산
 */
export function getTotalPages(perPage = POSTS_PER_PAGE) {
  const allPosts = getAllPublishedPosts()
  return Math.ceil(allPosts.length / perPage)
}
