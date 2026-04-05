import { Star, Play, Apple } from "lucide-react"
import type { Competitor } from "@carefree-studio/shared"

interface Props {
  competitor: Competitor
}

export function CompetitorCard({ competitor }: Props) {
  const scorePercent = Math.min(100, (competitor.score / 5) * 100)

  return (
    <div className="rounded-xl border border-border bg-card p-4 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
      <div className="flex items-start gap-3">
        {competitor.iconUrl ? (
          <img
            src={competitor.iconUrl}
            alt={competitor.title}
            className="h-12 w-12 rounded-xl object-cover flex-shrink-0"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = "none"
            }}
          />
        ) : (
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-muted-foreground text-xl">G</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-sm text-foreground truncate">
              {competitor.title}
            </h3>
            <span
              className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium flex-shrink-0 ${
                competitor.platform === "google_play"
                  ? "bg-primary/10 text-primary"
                  : "bg-accent/10 text-accent-foreground"
              }`}
            >
              {competitor.platform === "google_play" ? (
                <>
                  <Play className="size-3" /> GP
                </>
              ) : (
                <>
                  <Apple className="size-3" /> AS
                </>
              )}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{competitor.genre}</p>
          {competitor.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {competitor.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <Star className="size-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
              <span className="text-xs font-mono text-foreground font-medium">
                {competitor.score.toFixed(1)}
              </span>
              <div className="h-1 flex-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
            </div>
            {competitor.installs && competitor.installs !== "0" && competitor.installs !== "" ? (
              <span className="text-xs text-muted-foreground">{competitor.installs} 설치</span>
            ) : competitor.ratings > 0 ? (
              <span className="text-xs text-muted-foreground">
                {competitor.ratings.toLocaleString()} 평가
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
