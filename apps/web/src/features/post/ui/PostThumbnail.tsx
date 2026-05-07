import Image from "next/image"
import { cn } from "@shared/lib"

/*
 * 포스트 썸네일 — 이미지가 있으면 next/image, 없으면 결정적 플레이스홀더.
 * 플레이스홀더는 제목 해시로 hue를 결정해서 같은 글은 항상 같은 색이 나온다 (Picsum 비결정성 회피).
 */

interface PostThumbnailProps {
  src?: string
  title: string
  className?: string
  /** Hard-coded width/height for next/image when provided. Defaults to 320x180. */
  width?: number
  height?: number
  priority?: boolean
}

function hashToHue(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0
  }
  // Restrict to Warm Ink family hues so placeholders feel native to the palette.
  // 250 (ink), 25 (coral), 75 (amber), 160 (sage), 295 (plum)
  const palette = [250, 25, 75, 160, 295]
  return palette[Math.abs(h) % palette.length]
}

export function PostThumbnail({
  src,
  title,
  className,
  width = 320,
  height = 180,
  priority,
}: PostThumbnailProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={title}
        width={width}
        height={height}
        className={cn("object-cover", className)}
        priority={priority}
        unoptimized
      />
    )
  }

  const hue = hashToHue(title)
  const initial = title.trim().charAt(0).toUpperCase() || "·"

  return (
    <div
      className={cn(
        "flex items-center justify-center select-none",
        "bg-[oklch(0.92_0.04_var(--ph-h))] dark:bg-[oklch(0.3_0.06_var(--ph-h))]",
        "text-[oklch(0.45_0.15_var(--ph-h))] dark:text-[oklch(0.78_0.13_var(--ph-h))]",
        className
      )}
      style={{ ["--ph-h" as string]: hue }}
      aria-hidden="true"
    >
      <span className="text-2xl font-bold tracking-tight" aria-hidden="true">
        {initial}
      </span>
    </div>
  )
}
