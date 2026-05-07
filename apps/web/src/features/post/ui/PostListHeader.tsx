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
    <div className="mb-10 sm:mb-12">
      {/* 제목 */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {(svgIcon || Icon) && (
            <div className="flex shrink-0 items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-muted">
              {svgIcon ? svgIcon : Icon && <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-foreground" />}
            </div>
          )}
          <h1
            className={cn(
              "font-bold tracking-tight break-keep min-w-0",
              "text-3xl sm:text-4xl md:text-5xl"
            )}
            style={{ letterSpacing: "-0.02em" }}
          >
            {type === "tag" && (
              <span className="text-muted-foreground font-normal mr-0.5">#</span>
            )}
            {title}
          </h1>
        </div>
        <span className="shrink-0 text-xs sm:text-sm text-muted-foreground tabular-nums">
          {count}개
        </span>
      </div>

      {/* 설명 */}
      {description && (
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {description}
        </p>
      )}

      {/* 구분선 */}
      <div className="mt-6 sm:mt-8 border-b border-border" />
    </div>
  )
}
