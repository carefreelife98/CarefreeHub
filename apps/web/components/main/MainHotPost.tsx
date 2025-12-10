import { SimplePost } from "../common/post/SimplePost"
import { posts } from "#site/content"

export function MainHotPost() {
  // 임시로 최신 3개 포스트 표시 (추후 조회수 기반으로 변경 가능)
  const hotPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <div className="w-full flex flex-col items-start justify-start gap-4">
      <div className="w-full flex flex-row items-center justify-between">
        <span className="text-sm whitespace-nowrap font-bold text-muted-foreground">
          인기 게시글
        </span>
      </div>

      <div className="w-full">
        {hotPosts.map((post) => (
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