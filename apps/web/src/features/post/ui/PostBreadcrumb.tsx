import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@shared/ui"
import { getCategoryPath } from "@shared/config"

interface PostBreadcrumbProps {
  category: string
  /** true면 마지막 카테고리를 현재 페이지(링크 없음)로 표시 */
  isCurrentPage?: boolean
}

export function PostBreadcrumb({ category, isCurrentPage = false }: PostBreadcrumbProps) {
  const categoryPath = getCategoryPath(category)

  if (categoryPath.length === 0) {
    return null
  }

  return (
    <Breadcrumb className="mb-6 pb-1 border-b">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/posts">Posts</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {categoryPath.map((node, idx) => {
          const isLast = idx === categoryPath.length - 1
          return (
            <span key={node.slug} className="contents">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast && isCurrentPage ? (
                  <BreadcrumbPage>{node.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={`/posts/category/${node.slug}`}>{node.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
