"use client"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

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
  const router = useRouter()

  return (
    <Card
      className="group p-0 gap-2 cursor-pointer overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
      onClick={() => router.push(linkUrl)}
    >
      <div className="aspect-[16/10] overflow-hidden p-3">
        <img
          src={thumbnailUrl}
          alt={title}
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
