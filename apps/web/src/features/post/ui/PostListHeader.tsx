import { LucideIcon } from "lucide-react"
import { cn } from "@shared/lib"
import { ReactNode } from "react"

interface PostListHeaderProps {
  /** 페이지 타입: category 또는 tag */
  type: "category" | "tag"
  /** 표시할 제목 */
  title: string
  /** 포스트 개수 */
  count: number
  /** Lucide 아이콘 (선택) */
  icon?: LucideIcon
  /** 커스텀 SVG 아이콘 (선택) - icon보다 우선 적용 */
  svgIcon?: ReactNode
  /** 설명 (선택) */
  description?: string
}

export function PostListHeader({
  type,
  title,
  count,
  icon: Icon,
  svgIcon,
  description,
}: PostListHeaderProps) {
  return (
    <div className="mb-10">
      {/* 제목 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {(svgIcon || Icon) && (
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted">
              {svgIcon ? svgIcon : Icon && <Icon className="w-6 h-6 text-foreground" />}
            </div>
          )}
          <h1 className={cn("font-bold tracking-tight", type === "tag" ? "text-4xl" : "text-4xl")}>
            {type === "tag" && <span className="text-muted-foreground font-normal">#</span>}
            {title}
          </h1>
        </div>
        <span className="text-sm text-muted-foreground">{count}개의 포스트</span>
      </div>

      {/* 설명 */}
      {description && <p className="mt-3 text-lg text-muted-foreground max-w-2xl">{description}</p>}

      {/* 구분선 */}
      <div className="mt-6 border-b border-border" />
    </div>
  )
}
