"use client"

import { Card, CardContent, Progress } from "@shared/ui"
import { CountUp } from "./CountUp"
import type { FeatureStat } from "../lib/types"

interface StatCardProps {
  stat: FeatureStat
}

export function StatCard({ stat }: StatCardProps) {
  if (stat.type === "text") {
    return (
      <Card className="border-indigo-500/20 bg-indigo-500/5 py-4 print:border-gray-300 print:bg-white">
        <CardContent className="px-4">
          <p className="text-xs text-muted-foreground">{stat.label}</p>
          <p className="mt-1 text-sm font-semibold text-indigo-400 print:text-indigo-700">
            {stat.value}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (stat.type === "progress") {
    const numValue = typeof stat.value === "number" ? stat.value : parseFloat(String(stat.value))
    return (
      <Card className="border-emerald-500/20 bg-emerald-500/5 py-4 print:border-gray-300 print:bg-white">
        <CardContent className="px-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-sm font-bold tabular-nums text-emerald-400 print:text-emerald-700">
              <CountUp end={numValue} decimals={1} suffix={stat.suffix} />
            </p>
          </div>
          <Progress
            value={numValue}
            className="mt-2 h-1.5 bg-emerald-500/20 [&>[data-slot=progress-indicator]]:bg-emerald-500"
          />
        </CardContent>
      </Card>
    )
  }

  // countup
  const numValue = typeof stat.value === "number" ? stat.value : 0
  return (
    <Card className="border-violet-500/20 bg-violet-500/5 py-4 print:border-gray-300 print:bg-white">
      <CardContent className="px-4 text-center">
        <p className="text-2xl font-bold text-violet-400 print:text-violet-700">
          <CountUp end={numValue} suffix={stat.suffix} />
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
      </CardContent>
    </Card>
  )
}
