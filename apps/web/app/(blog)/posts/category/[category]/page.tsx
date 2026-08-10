import { posts } from "#site/content"
import { Metadata } from "next"
import { GridPost, PostBreadcrumb, PostListHeader } from "@features/post"
import {
  findCategoryBySlug,
  getAllCategorySlugs,
  getCategoryWithDescendants,
  getCategoryIcon,
  getCategoryColor,
} from "@shared/config"
import { getCategoryCustomIcon } from "@shared/icons"

export async function generateStaticParams() {
  // 카테고리 트리 전체 사용 — 포스트가 없는 부모 카테고리도 프리렌더
  return getAllCategorySlugs().map((slug) => ({ category: slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const categoryNode = findCategoryBySlug(category)
  const displayName = categoryNode?.name || category
  return {
    title: displayName,
    description: categoryNode?.description || `${displayName} 카테고리의 포스트 목록`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const targetSlugs = getCategoryWithDescendants(category)
  const categoryPosts = posts
    .filter(
      (post) =>
        post.published && post.categories.some((cat) => targetSlugs.includes(cat.toLowerCase()))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const categoryNode = findCategoryBySlug(category)
  const displayName = categoryNode?.name || category

  const CustomIcon = getCategoryCustomIcon(category)
  const LucideIcon = getCategoryIcon(category)

  return (
    <div className="w-full flex flex-col gap-4">
      <PostBreadcrumb category={category} isCurrentPage />

      <PostListHeader
        type="category"
        title={displayName}
        count={categoryPosts.length}
        icon={CustomIcon ? undefined : LucideIcon}
        // 모듈 스코프의 정적 아이콘 맵에서 조회하므로 렌더마다 새 컴포넌트가 생성되지 않음
        // eslint-disable-next-line react-hooks/static-components
        svgIcon={CustomIcon ? <CustomIcon size={24} /> : undefined}
      />

      {categoryPosts.length === 0 ? (
        <div className="flex flex-col h-full gap-4 items-center justify-center">
          <p className="text-muted-foreground">아직 등록된 포스트가 없습니다 🥲</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {categoryPosts.map((post) => (
            <GridPost
              key={post.slug}
              title={post.title}
              description={post.description}
              author={post.author}
              createdAt={new Date(post.date).toLocaleDateString("ko-KR")}
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
      )}
    </div>
  )
}
