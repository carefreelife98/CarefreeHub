import Link from "next/link"
import { ArrowRight, Layers } from "lucide-react"
import { Badge } from "@shared/ui"

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  ongoing: { label: "연재중", className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  completed: { label: "완결", className: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  planned: { label: "연재 예정", className: "bg-muted text-muted-foreground" },
}

interface SeriesCardProps {
  slug: string
  title: string
  description: string
  status: string
  postCount: number
  latestDate?: string
}

export function SeriesCard({
  slug,
  title,
  description,
  status,
  postCount,
  latestDate,
}: SeriesCardProps) {
  const statusInfo = STATUS_LABEL[status] ?? STATUS_LABEL.planned
  const hasContent = postCount > 0

  const inner = (
    <>
      <div className="flex items-center gap-2 mb-2">
        <Layers className="size-4 text-primary shrink-0" />
        <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
          {title}
        </h2>
        <Badge variant="secondary" className={`border-0 text-xs ${statusInfo.className}`}>
          {statusInfo.label}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{hasContent ? `${postCount}편` : "곧 시작합니다"}</span>
        {latestDate && (
          <>
            <span>·</span>
            <span>최근 업데이트 {latestDate}</span>
          </>
        )}
        {hasContent && (
          <ArrowRight className="ml-auto size-4 group-hover:translate-x-1 transition-transform" />
        )}
      </div>
    </>
  )

  const cardClass =
    "group block rounded-xl border border-border p-5 transition-colors hover:bg-muted/50"

  return hasContent ? (
    <Link href={`/series/${slug}`} className={cardClass}>
      {inner}
    </Link>
  ) : (
    <div className={cardClass.replace(" hover:bg-muted/50", "")}>{inner}</div>
  )
}
