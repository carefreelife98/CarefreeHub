import { SimplePost } from "@features/post"
import { posts } from "#site/content"

export function MainHotPost() {
  // 작성자 추천 글 — frontmatter의 featured 플래그 우선, 없으면 최신순
  const recommendedPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => {
      // featured 플래그가 있으면 우선
      const aFeatured = (a as { featured?: boolean }).featured ? 1 : 0
      const bFeatured = (b as { featured?: boolean }).featured ? 1 : 0
      if (aFeatured !== bFeatured) return bFeatured - aFeatured
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 3)

  return (
    <div className="w-full flex flex-col items-start justify-start gap-4">
      <div className="w-full flex flex-row items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground whitespace-nowrap">
          추천 게시글
        </h2>
      </div>

      <div className="w-full">
        {recommendedPosts.map((post) => (
          <SimplePost
            key={post.slug}
            title={post.title}
            createdBy={post.author}
            linkUrl={`/posts/${post.slug}`}
          />
        ))}
      </div>
    </div>
  )
}
