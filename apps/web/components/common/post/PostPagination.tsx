import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"

interface PostPaginationProps {
  currentPage: number
  totalPages: number
  basePath?: string
}

export function PostPagination({
  currentPage,
  totalPages,
  basePath = "/posts/page",
}: PostPaginationProps) {
  if (totalPages <= 1) return null

  const getPageHref = (page: number) => {
    if (page === 1) return "/posts"
    return `${basePath}/${page}`
  }

  // 표시할 페이지 번호 계산
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    const showPages = 5 // 최대 표시할 페이지 수

    if (totalPages <= showPages) {
      // 전체 페이지가 적으면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 항상 첫 페이지 표시
      pages.push(1)

      if (currentPage > 3) {
        pages.push("ellipsis")
      }

      // 현재 페이지 주변
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis")
      }

      // 항상 마지막 페이지 표시
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={getPageHref(currentPage - 1)} />
          </PaginationItem>
        )}

        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink href={getPageHref(page)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={getPageHref(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
