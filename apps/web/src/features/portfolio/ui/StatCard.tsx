"use client"

import { Card, CardContent, Progress } from "@shared/ui"
import { CountUp } from "./CountUp"
import type { FeatureStat } from "../lib/types"

/*
 * Stat 카드 — 잉크 단일 액센트.
 * 카드 종류로 색을 다르게 칠하지 않는다 (안티-시멘틱).
 * 의미 차이는 레이아웃과 progress 막대 유무로만 표현.
 */

interface StatCardProps {
  stat: FeatureStat
}

export function StatCard({ stat }: StatCardProps) {
  if (stat.type === "text") {
    return (
      <Card className="border-border/60 bg-card py-4 print:border-gray-300 print:bg-white">
        <CardContent className="px-3 sm:px-4">
          <p className="text-xs text-muted-foreground">{stat.label}</p>
          <p className="mt-1 text-sm font-semibold text-foreground print:text-gray-800">
            {stat.value}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (stat.type === "progress") {
    const numValue = typeof stat.value === "number" ? stat.value : parseFloat(String(stat.value))
    return (
      <Card className="border-border/60 bg-card py-4 print:border-gray-300 print:bg-white">
        <CardContent className="px-3 sm:px-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-sm font-bold tabular-nums text-primary print:text-gray-800">
              <CountUp end={numValue} decimals={1} suffix={stat.suffix} />
            </p>
          </div>
          <Progress
            value={numValue}
            className="mt-2 h-1.5 bg-primary/15 [&>[data-slot=progress-indicator]]:bg-primary"
          />
        </CardContent>
      </Card>
    )
  }

  // countup
  const numValue = typeof stat.value === "number" ? stat.value : 0
  return (
    <Card className="border-border/60 bg-card py-4 print:border-gray-300 print:bg-white">
      <CardContent className="px-3 sm:px-4 text-center">
        <p className="text-2xl font-bold text-primary print:text-gray-800 tabular-nums">
          <CountUp end={numValue} suffix={stat.suffix} />
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
      </CardContent>
    </Card>
  )
}
