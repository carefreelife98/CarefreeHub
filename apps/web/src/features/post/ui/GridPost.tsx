"use client"

import { Card, CardContent, CardDescription, CardTitle } from "@shared/ui"
import { Badge } from "@shared/ui"
import { useRouter } from "next/navigation"
import { cn } from "@shared/lib"
import { PostThumbnail } from "./PostThumbnail"

interface Chip {
  label: string
  href: string
  color?: string
}

interface GridPostProps {
  title: string
  description?: string
  author: string
  createdAt: string
  thumbnailUrl?: string
  linkUrl: string
  chips?: Chip[]
}

export function GridPost({
  title,
  description,
  author,
  createdAt,
  thumbnailUrl,
  linkUrl,
  chips,
}: GridPostProps) {
  const router = useRouter()

  return (
    <Card
      className="group p-0 gap-2 cursor-pointer overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:shadow-lg hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      onClick={() => router.push(linkUrl)}
    >
      <div className="aspect-[16/10] overflow-hidden p-3">
        <div className="h-full w-full overflow-hidden rounded-lg">
          <PostThumbnail
            src={thumbnailUrl}
            title={title}
            className="h-full w-full transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            width={320}
            height={200}
          />
        </div>
      </div>
      <CardContent className="p-3">
        {chips && chips.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {chips.slice(0, 2).map((chip) => (
              <Badge
                key={chip.href}
                variant="secondary"
                className={cn(
                  "text-[10px] px-1.5 py-0 h-4 cursor-pointer transition-colors border-0",
                  chip.color || "hover:bg-primary hover:text-primary-foreground"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(chip.href)
                }}
              >
                {chip.label}
              </Badge>
            ))}
          </div>
        )}
        <CardTitle className="text-sm font-semibold tracking-tight leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors break-keep">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-xs line-clamp-2 mb-2 break-keep">
            {description}
          </CardDescription>
        )}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{author}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{createdAt}</span>
        </div>
      </CardContent>
    </Card>
  )
}
