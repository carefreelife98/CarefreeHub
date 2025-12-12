import { posts } from "#site/content"
import { ThumbnailPost } from "@/components/common/post/ThumbnailPost"
import { PostListHeader } from "@/components/post/PostListHeader"

export async function generateStaticParams() {
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags)))

  return tags.map((tag) => ({
    tag: tag.toLowerCase(),
  }))
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  const tagPosts = posts
    .filter(
      (post) => post.published && post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="flex flex-col gap-4">
      <PostListHeader type="tag" title={tag} count={tagPosts.length} />

      <div className="space-y-4">
        {tagPosts.map((post) => (
          <ThumbnailPost
            key={post.slug}
            title={post.title}
            description={post.description || ""}
            createdAt={new Date(post.date).toLocaleDateString("ko-KR")}
            createdBy={post.author}
            thumbnailUrl={post.thumbnail || "https://picsum.photos/200/300"}
            linkUrl={`/posts/${post.slug}`}
            chips={post.tags.map((t) => ({
              label: `#${t}`,
              href: `/posts/tag/${t.toLowerCase()}`,
            }))}
          />
        ))}
      </div>
    </div>
  )
}
