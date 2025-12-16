import { ThumbnailPost } from "@/components/common/post/ThumbnailPost"
import { PostPagination } from "@/components/common/post/PostPagination"
import { getPaginatedPosts, getTotalPages } from "@/lib/posts"
import { getCategoryColor } from "@/config/categories"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ page: string }>
}

export async function generateStaticParams() {
  const totalPages = getTotalPages()

  // 2페이지부터 생성 (1페이지는 /posts에서 처리)
  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    page: String(i + 2),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page } = await params
  const pageNum = parseInt(page, 10)

  return {
    title: `전체 게시글 - ${pageNum}페이지`,
    description: `Carefree Hub의 모든 기술 블로그 포스트 ${pageNum}페이지입니다.`,
  }
}

export default async function PostsPageNumber({ params }: PageProps) {
  const { page } = await params
  const pageNum = parseInt(page, 10)

  if (isNaN(pageNum) || pageNum < 1) {
    notFound()
  }

  // 1페이지는 /posts로 리다이렉트
  if (pageNum === 1) {
    notFound()
  }

  const { posts, totalPages, currentPage } = getPaginatedPosts(pageNum)

  if (pageNum > totalPages) {
    notFound()
  }

  return (
    <div className="w-full flex flex-col px-4 md:px-8 lg:px-16 xl:px-32 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">전체 게시글</h1>
        <p className="text-muted-foreground mt-2">
          모든 포스트를 확인하세요. ({currentPage} / {totalPages} 페이지)
        </p>
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
