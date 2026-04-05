"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import type { Competitor } from "@carefree-studio/shared"

interface Props {
  competitors: Competitor[]
}

interface GenreData {
  name: string
  count: number
  games: string[]
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: GenreData }[]
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

export function GenreDistChart({ competitors }: Props) {
  const genreMap: Record<string, { count: number; games: string[] }> = {}
  for (const c of competitors) {
    const genre = c.genre?.trim()
    if (!genre) continue
    if (!genreMap[genre]) genreMap[genre] = { count: 0, games: [] }
    genreMap[genre].count++
    genreMap[genre].games.push(c.title)
  }

  const sorted = Object.entries(genreMap).sort(([, a], [, b]) => b.count - a.count)

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-display font-bold text-sm text-foreground mb-4">장르 분포</h3>
        <p className="text-sm text-muted-foreground text-center py-8">장르 데이터 없음</p>
      </div>
    )
  }

  const top5 = sorted.slice(0, 5)
  const othersEntries = sorted.slice(5)
  const othersCount = othersEntries.reduce((sum, [, v]) => sum + v.count, 0)
  const othersGames = othersEntries.flatMap(([, v]) => v.games)

  const data: GenreData[] = [
    ...top5.map(([name, v]) => ({ name, count: v.count, games: v.games })),
    ...(othersCount > 0 ? [{ name: "기타", count: othersCount, games: othersGames }] : []),
  ]

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="font-display font-bold text-sm text-foreground mb-4">장르 분포</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <XAxis
            type="number"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.5 }} />
          <Bar dataKey="count" fill="var(--primary)" radius={[0, 4, 4, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
