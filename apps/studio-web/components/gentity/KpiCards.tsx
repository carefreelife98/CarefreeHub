"use client"

import { LayoutGrid, MessageSquare, Star, Smartphone } from "lucide-react"
import type { Competitor } from "@carefree-studio/shared"

interface Props {
  competitors: Competitor[]
  totalReviews: number
}

export function KpiCards({ competitors, totalReviews }: Props) {
  const avgScore =
    competitors.length > 0
      ? (competitors.reduce((s, c) => s + c.score, 0) / competitors.length).toFixed(1)
      : "0.0"

  const gpCount = competitors.filter((c) => c.platform === "google_play").length
  const asCount = competitors.length - gpCount
  const gpPct = competitors.length > 0 ? Math.round((gpCount / competitors.length) * 100) : 0

  const cards = [
    {
      label: "경쟁작 수집",
      value: String(competitors.length),
      sub: "앱 분석됨",
      icon: LayoutGrid,
      color: "text-primary",
    },
    {
      label: "리뷰 분석",
      value: totalReviews.toLocaleString(),
      sub: "리뷰 수집됨",
      icon: MessageSquare,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "평균 평점",
      value: avgScore,
      sub: "경쟁작 평균",
      icon: Star,
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "플랫폼 비율",
      value: `${gpPct}/${100 - gpPct}`,
      sub: `Google Play ${gpCount} · App Store ${asCount}`,
      icon: Smartphone,
      color: "text-violet-600 dark:text-violet-400",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
            <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center`}>
              <card.icon className={`size-4 ${card.color}`} />
            </div>
          </div>
          <p className="font-display text-2xl font-black text-foreground">{card.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  )
}
