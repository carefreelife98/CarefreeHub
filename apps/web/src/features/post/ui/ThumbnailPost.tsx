"use client"

import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@shared/ui"
import { Badge } from "@shared/ui"
import { useRouter } from "next/navigation"
import { cn } from "@shared/lib"
import { PostThumbnail } from "./PostThumbnail"

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
  updatedAt?: string
  thumbnailUrl?: string
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
  const router = useRouter()

  return (
    <Card
      className="w-full p-0 rounded-none border-none shadow-none cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => router.push(linkUrl)}
    >
      <CardContent className="flex flex-col sm:flex-row items-stretch sm:items-start justify-start gap-3 sm:gap-4 py-4">
        <div className="order-first sm:order-last w-full aspect-[16/9] sm:w-[130px] sm:h-[90px] sm:aspect-auto sm:flex-none rounded-lg overflow-hidden">
          <PostThumbnail
            src={thumbnailUrl}
            title={title}
            className="w-full h-full"
            width={260}
            height={180}
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col items-start justify-start">
          {chips && chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {chips.slice(0, 3).map((chip) => (
                <Badge
                  key={chip.href}
                  variant="secondary"
                  className={cn(
                    "text-xs px-2 py-0.5 cursor-pointer transition-colors border-0",
                    chip.color || "hover:bg-primary hover:text-primary-foreground"
                  )}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    router.push(chip.href)
                  }}
                >
                  {chip.label}
                </Badge>
              ))}
            </div>
          )}
          <CardTitle className="text-base sm:text-lg md:text-xl font-semibold leading-snug tracking-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors break-keep">
            {title}
          </CardTitle>
          <CardDescription className="text-sm line-clamp-2 sm:line-clamp-3 mb-2">
            {description}
          </CardDescription>
          <CardFooter className="p-0">
            <span className="text-xs sm:text-sm text-muted-foreground">
              <span className="tabular-nums">{createdAt}</span> · {createdBy}
            </span>
          </CardFooter>
        </div>
      </CardContent>
    </Card>
  )
}
