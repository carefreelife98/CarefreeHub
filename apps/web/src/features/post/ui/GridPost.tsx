"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardTitle } from "@shared/ui"
import { Badge } from "@shared/ui"
import { cn } from "@shared/lib"
import { trackPostClick } from "@features/analytics"

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
  thumbnailUrl: string
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
  return (
    <Card className="group relative p-0 gap-2 overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      {/* 카드 전체를 덮는 실제 링크 (SEO/키보드 접근성) */}
      <Link
        href={linkUrl}
        aria-label={title}
        className="absolute inset-0 z-0"
        onClick={() => trackPostClick({ slug: linkUrl.replace("/posts/", ""), title })}
      />
      <div className="aspect-[16/10] overflow-hidden p-3">
        <img
          src={thumbnailUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
        />
      </div>
      <CardContent className="p-3">
        {chips && chips.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {chips.slice(0, 2).map((chip) => (
              <Badge
                key={chip.href}
                variant="secondary"
                className={cn(
                  "relative z-10 text-[10px] px-1.5 py-0 h-4 transition-colors border-0",
                  chip.color || "hover:bg-primary hover:text-primary-foreground"
                )}
                asChild
              >
                <Link href={chip.href}>{chip.label}</Link>
              </Badge>
            ))}
          </div>
        )}
        <CardTitle className="text-sm font-semibold line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-xs line-clamp-2 mb-2">{description}</CardDescription>
        )}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{author}</span>
          <span>·</span>
          <span>{createdAt}</span>
        </div>
      </CardContent>
    </Card>
  )
}
