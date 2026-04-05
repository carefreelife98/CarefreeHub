import { Heart, AlertCircle, Zap, TrendingUp, Star, ThumbsUp, Play, Apple } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ReviewSample, ReviewInsights } from "@carefree-studio/shared"

interface InsightSectionProps {
  title: string
  icon: React.ReactNode
  reviews: ReviewSample[]
  borderClass: string
}

function InsightSection({ title, icon, reviews, borderClass }: InsightSectionProps) {
  if (reviews.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
        {icon}
        {title}
        <span className="text-xs font-mono text-muted-foreground font-normal">
          ({reviews.length}개 리뷰)
        </span>
      </h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-2 pr-4">
          {reviews.map((review, i) => {
            const score = Math.min(5, Math.max(0, Math.round(review.score)))
            const scorePercent = (score / 5) * 100
            return (
              <div
                key={`${review.platform}-${i}-${review.text.slice(0, 20)}`}
                className={`rounded-lg border border-border ${borderClass} bg-card px-4 py-3 space-y-1`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="size-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-mono font-medium text-foreground">{score}</span>
                  </div>
                  {review.thumbsUp > 0 && (
                    <div className="flex items-center gap-0.5 text-muted-foreground">
                      <ThumbsUp className="size-3" />
                      <span className="text-xs">{review.thumbsUp}</span>
                    </div>
                  )}
                  {review.competitorTitle && (
                    <span className="rounded-md px-2 py-0.5 text-xs font-medium bg-muted text-foreground">
                      {review.competitorTitle}
                    </span>
                  )}
                  <span
                    className={`flex items-center gap-1 text-xs font-medium ml-auto rounded-md px-2 py-0.5 ${
                      review.platform === "google_play"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/10 text-accent-foreground"
                    }`}
                  >
                    {review.platform === "google_play" ? (
                      <>
                        <Play className="size-3" /> Google Play
                      </>
                    ) : (
                      <>
                        <Apple className="size-3" /> App Store
                      </>
                    )}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{review.text}</p>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

interface Props {
  insights: ReviewInsights
}

export function InsightPanel({ insights }: Props) {
  const summaryCards = [
    {
      label: "강점",
      count: insights.topStrengths.length,
      color: "bg-emerald-600 dark:bg-emerald-400",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "페인포인트",
      count: insights.topPainPoints.length,
      color: "bg-red-600 dark:bg-red-400",
      textColor: "text-red-600 dark:text-red-400",
    },
    {
      label: "미충족 니즈",
      count: insights.unmetNeeds.length,
      color: "bg-amber-600 dark:bg-amber-400",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "트렌드",
      count: insights.trendPatterns.length,
      color: "bg-primary",
      textColor: "text-primary",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-4 flex items-center gap-3"
          >
            <div className={`w-1 h-10 rounded-full ${card.color}`} />
            <div>
              <p className={`font-display text-xl font-black ${card.textColor}`}>{card.count}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Review Sections — 2x2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightSection
          title="유저가 좋아하는 것"
          icon={<Heart className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
          reviews={insights.topStrengths}
          borderClass="border-l-2 border-l-emerald-600 dark:border-l-emerald-400"
        />
        <InsightSection
          title="유저 페인포인트"
          icon={<AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />}
          reviews={insights.topPainPoints}
          borderClass="border-l-2 border-l-red-600 dark:border-l-red-400"
        />
        <InsightSection
          title="충족되지 않은 니즈"
          icon={<Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
          reviews={insights.unmetNeeds}
          borderClass="border-l-2 border-l-amber-600 dark:border-l-amber-400"
        />
        <InsightSection
          title="트렌드 패턴"
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          reviews={insights.trendPatterns}
          borderClass="border-l-2 border-l-primary"
        />
      </div>
    </div>
  )
}
