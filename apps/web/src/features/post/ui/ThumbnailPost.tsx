"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@shared/ui"
import { Badge } from "@shared/ui"
import { cn } from "@shared/lib"
import { trackPostClick } from "@features/analytics"

interface Chip {
  label: string
  href: string
  color?: string
}

interface ThumbnailPostProps {
  title: string
  description: string
  createdAt: string
  createdBy: string
  thumbnailUrl: string
  linkUrl: string
  chips?: Chip[]
}

export function ThumbnailPost({
  title,
  description,
  createdAt,
  createdBy,
  thumbnailUrl,
  linkUrl,
  chips,
}: ThumbnailPostProps) {
  return (
    <Card className="relative w-full p-0 rounded-none border-none shadow-none hover:bg-muted/50 transition-colors">
      {/* 카드 전체를 덮는 실제 링크 (SEO/키보드 접근성) */}
      <Link
        href={linkUrl}
        aria-label={title}
        className="absolute inset-0 z-0"
        onClick={() => trackPostClick({ slug: linkUrl.replace("/posts/", ""), title })}
      />
      <CardContent className="flex flex-row items-start justify-start gap-4 py-4">
        <div className="flex-[3] flex-col items-start justify-start">
          {chips && chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {chips.slice(0, 3).map((chip) => (
                <Badge
                  key={chip.href}
                  variant="secondary"
                  className={cn(
                    "relative z-10 text-xs px-2 py-0.5 transition-colors border-0",
                    chip.color || "hover:bg-primary hover:text-primary-foreground"
                  )}
                  asChild
                >
                  <Link href={chip.href}>{chip.label}</Link>
                </Badge>
              ))}
            </div>
          )}
          <CardTitle className="text-2xl font-bold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-3 mb-2">{description}</CardDescription>
          <CardFooter className="p-0">
            <span className="text-sm text-muted-foreground">
              {createdAt} · {createdBy}
            </span>
          </CardFooter>
        </div>
        <img
          src={thumbnailUrl}
          alt={title}
          loading="lazy"
          className="flex-[1] w-[130px] h-[90px] rounded-lg object-cover"
        />
      </CardContent>
    </Card>
  )
}
