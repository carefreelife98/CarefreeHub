/* eslint-disable react-hooks/static-components -- 카테고리 lookup 테이블 기반 아이콘 참조, idempotent */
import { posts } from "#site/content"
import { GridPost, PostBreadcrumb, PostListHeader, ThumbnailPost } from "@features/post"
import {
  findCategoryBySlug,
  getCategoryWithDescendants,
  getCategoryIcon,
  getCategoryColor,
} from "@shared/config"
import { getCategoryCustomIcon } from "@shared/icons"

export async function generateStaticParams() {
  const categories = Array.from(new Set(posts.flatMap((post) => post.categories)))

  return categories.map((category) => ({
    category: category.toLowerCase(),
  }))
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
        svgIcon={CustomIcon ? <CustomIcon size={24} /> : undefined}
      />

      {categoryPosts.length === 0 ? (
        <div className="flex flex-col h-full gap-4 items-center justify-center py-20">
          <p className="text-muted-foreground">아직 등록된 포스트가 없습니다 🥲</p>
        </div>
      ) : (
        // 첫 글은 풀폭 ThumbnailPost로 강조, 나머지는 grid (모바일 1열, 데스크톱 최대 3열)
        // identical card grid 안티패턴 회피: 첫 글에 시각 위계 부여.
        <div className="space-y-6">
          <ThumbnailPost
            key={categoryPosts[0].slug}
            title={categoryPosts[0].title}
            description={categoryPosts[0].description || ""}
            createdAt={new Date(categoryPosts[0].date).toLocaleDateString("ko-KR")}
            createdBy={categoryPosts[0].author}
            thumbnailUrl={categoryPosts[0].thumbnail}
            linkUrl={`/posts/${categoryPosts[0].slug}`}
            chips={categoryPosts[0].categories.map((cat) => ({
              label: cat,
              href: `/posts/category/${cat.toLowerCase()}`,
              color: getCategoryColor(cat.toLowerCase()),
            }))}
          />
          {categoryPosts.length > 1 && (
            <>
              <div className="border-t border-border/60" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryPosts.slice(1).map((post) => (
                  <GridPost
                    key={post.slug}
                    title={post.title}
                    description={post.description}
                    author={post.author}
                    createdAt={new Date(post.date).toLocaleDateString("ko-KR")}
                    thumbnailUrl={post.thumbnail}
                    linkUrl={`/posts/${post.slug}`}
                    chips={post.categories.map((cat) => ({
                      label: cat,
                      href: `/posts/category/${cat.toLowerCase()}`,
                      color: getCategoryColor(cat.toLowerCase()),
                    }))}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
