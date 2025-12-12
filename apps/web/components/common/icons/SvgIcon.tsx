import { cn } from "@/lib/utils"

export interface SvgIconProps {
  /** SVG viewBox (기본값: "0 0 128 128") */
  viewBox?: string
  /** 아이콘 크기 (width, height 동일하게 적용) */
  size?: number | string
  /** 추가 className */
  className?: string
  /** SVG children (path, circle 등) */
  children: React.ReactNode
}

/**
 * SVG 아이콘 베이스 컴포넌트
 *
 * @example
 * ```tsx
 * <SvgIcon size={24} viewBox="0 0 128 128">
 *   <path d="..." fill="#77bc1f" />
 * </SvgIcon>
 * ```
 */
export function SvgIcon({ viewBox = "0 0 128 128", size = 24, className, children }: SvgIconProps) {
  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      className={cn("flex-shrink-0", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  )
}
