import { RecapBanner, getBlogRecapStats } from "@features/recap"

export function MainRecapBanner() {
  const currentYear = new Date().getFullYear()
  const stats = getBlogRecapStats(currentYear)

  // 올해 포스트가 없으면 배너를 표시하지 않음
  if (stats.totalPosts === 0) {
    return null
  }

  return <RecapBanner year={currentYear} postCount={stats.totalPosts} />
}
