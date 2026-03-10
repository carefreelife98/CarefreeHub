import Image from "next/image"
import type { ScreenshotPlaceholder } from "../lib/types"

interface ImageWithCaptionProps {
  screenshot: ScreenshotPlaceholder
  priority?: boolean
  onClick?: () => void
}

export function ImageWithCaption({ screenshot, priority, onClick }: ImageWithCaptionProps) {
  return (
    <figure className="my-4">
      <div
        className="overflow-hidden rounded-lg border border-border/40 cursor-pointer transition-opacity hover:opacity-90 print:cursor-default"
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      >
        <Image
          src={screenshot.src}
          alt={screenshot.alt}
          width={1200}
          height={675}
          className="w-full object-cover"
          priority={priority}
          loading="eager"
          unoptimized
        />
      </div>
      <figcaption className="mt-2 text-center text-sm text-muted-foreground">
        {screenshot.caption}
      </figcaption>
    </figure>
  )
}
