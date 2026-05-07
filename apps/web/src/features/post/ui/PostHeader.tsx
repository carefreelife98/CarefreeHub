import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Clock } from "lucide-react"
import { findCategoryBySlug, getCategoryColor } from "@shared/config"
import { cn } from "@shared/lib"

interface PostHeaderProps {
  title: string
  description?: string
  author: string
  date: string
  readingTime: number
  categories: string[]
  thumbnail?: string
}

export function PostHeader({
  title,
  description,
  author,
  date,
  readingTime,
  categories,
  thumbnail,
}: PostHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex gap-6">
        {/* Thumbnail - 작은 사이즈로 좌측에 */}
        {thumbnail && (
          <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border border-border/50">
            <Image
              src={thumbnail}
              alt={title}
              width={128}
              height={128}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex gap-2 mb-2">
              {categories.map((cat) => {
                const node = findCategoryBySlug(cat)
                const color = getCategoryColor(cat.toLowerCase())
                return (
                  <Link
                    key={cat}
                    href={`/posts/category/${cat.toLowerCase()}`}
                    className={cn(
                      "text-xs font-medium px-2.5 py-1 rounded-full transition-colors",
                      color || "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                  >
                    {node?.name || cat}
                  </Link>
                )
              })}
            </div>
          )}

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 break-keep"
            style={{ letterSpacing: "-0.02em" }}
          >
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-base sm:text-lg text-muted-foreground mb-4 leading-relaxed line-clamp-2 break-keep">
              {description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <time dateTime={date}>
                {new Date(date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{readingTime}분 소요</span>
            </div>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="mt-6 border-b border-border" />
    </header>
  )
}
