"use client"

import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

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
  const router = useRouter()

  return (
    <Card
      className="w-full p-0 rounded-none border-none shadow-none cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => router.push(linkUrl)}
    >
      <CardContent className="flex flex-row items-start justify-start gap-4 py-4">
        <div className="flex-[3] flex-col items-start justify-start">
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
          className="flex-[1] w-[130px] h-[90px] rounded-lg object-cover"
        />
      </CardContent>
    </Card>
  )
}
