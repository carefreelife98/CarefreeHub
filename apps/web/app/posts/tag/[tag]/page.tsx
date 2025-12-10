import { posts } from "#site/content"
import { ThumbnailPost } from "@/components/common/post/ThumbnailPost"

export async function generateStaticParams() {
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags)))

  return tags.map((tag) => ({
    tag: tag.toLowerCase(),
  }))
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params
  const tagPosts = posts
    .filter(
      (post) =>
        post.published && post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <h1 className="text-3xl font-bold mb-8 capitalize">태그: #{tag}</h1>

      <div className="space-y-4">
        {tagPosts.map((post) => (
          <ThumbnailPost
            key={post.slug}
            title={post.title}
            description={post.description || ""}
            createdAt={new Date(post.date).toLocaleDateString("ko-KR")}
            createdBy={post.author}
            updatedAt={
              post.updated
                ? new Date(post.updated).toLocaleDateString("ko-KR")
                : undefined
            }
            thumbnailUrl={post.thumbnail || "https://picsum.photos/200/300"}
            linkUrl={`/posts/${post.slug}`}
          />
        ))}
      </div>
    </div>
  )
}
