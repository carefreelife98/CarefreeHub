import { posts } from "#site/content"
import { ThumbnailPost } from "@/components/common/post/ThumbnailPost"

export async function generateStaticParams() {
  const categories = Array.from(new Set(posts.flatMap((post) => post.categories)))

  return categories.map((category) => ({
    category: category.toLowerCase(),
  }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const categoryPosts = posts
    .filter(
      (post) =>
        post.published &&
        post.categories.some((cat) => cat.toLowerCase() === category.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <h1 className="text-3xl font-bold mb-8 capitalize">카테고리: {category}</h1>

      <div className="space-y-4">
        {categoryPosts.map((post) => (
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
