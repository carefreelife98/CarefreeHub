import { SimplePost } from "@features/post"
import { getHotPosts } from "@shared/lib/posts"

export function MainHotPost() {
  const hotPosts = getHotPosts(3)

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
