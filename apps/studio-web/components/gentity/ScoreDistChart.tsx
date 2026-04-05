"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { Competitor } from "@carefree-studio/shared"

interface Props {
  competitors: Competitor[]
}

interface BucketData {
  name: string
  count: number
  games: string[]
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: BucketData }[]
}) {
  if (!active || !payload?.[0]) return null
  const data = payload[0].payload
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg max-w-[240px]">
      <p className="text-xs font-bold text-foreground mb-1">
        {data.name} — {data.count}개 앱
      </p>
      {data.games.length > 0 && (
        <ul className="text-xs text-muted-foreground space-y-0.5">
          {data.games.slice(0, 5).map((g) => (
            <li key={g} className="truncate">
              • {g}
            </li>
          ))}
          {data.games.length > 5 && (
            <li className="text-muted-foreground/60">외 {data.games.length - 5}개</li>
          )}
        </ul>
      )}
    </div>
  )
}

export function ScoreDistChart({ competitors }: Props) {
  const buckets: BucketData[] = [1, 2, 3, 4, 5].map((star) => {
    const matching = competitors.filter((c) => Math.round(c.score) === star)
    return {
      name: `${star}점`,
      count: matching.length,
      games: matching.map((c) => c.title),
    }
  })

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="font-display font-bold text-sm text-foreground mb-4">평점 분포</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={buckets} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.5 }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {buckets.map((_, i) => (
              <Cell
                key={i}
                fill={i >= 3 ? "var(--primary)" : "var(--muted-foreground)"}
                opacity={i >= 3 ? 1 : 0.3}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
