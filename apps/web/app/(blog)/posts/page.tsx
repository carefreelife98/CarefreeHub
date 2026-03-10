import { ThumbnailPost, PostPagination } from "@features/post"
import { getPaginatedPosts } from "@shared/lib"
import { getCategoryColor } from "@shared/config"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "전체 게시글",
  description: "Carefree Hub의 모든 기술 블로그 포스트를 확인하세요.",
}

export default function PostsPage() {
  const { posts, totalPages, currentPage } = getPaginatedPosts(1)

  return (
    <div className="w-full flex flex-col px-4 md:px-8 lg:px-16 xl:px-32 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">전체 게시글</h1>
        <p className="text-muted-foreground mt-2">모든 포스트를 확인하세요.</p>
      </div>

      <div className="w-full">
        {posts.map((post) => (
          <ThumbnailPost
            key={post.slug}
            title={post.title}
            description={post.description || ""}
            createdAt={new Date(post.date).toLocaleDateString("ko-KR")}
            createdBy={post.author}
            updatedAt={
              post.updated ? new Date(post.updated).toLocaleDateString("ko-KR") : undefined
            }
            thumbnailUrl={post.thumbnail || "https://picsum.photos/200/300"}
            linkUrl={`/posts/${post.slug}`}
            chips={post.categories.map((cat) => ({
              label: cat,
              href: `/posts/category/${cat.toLowerCase()}`,
              color: getCategoryColor(cat.toLowerCase()),
            }))}
          />
        ))}
      </div>

      <PostPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}
