import { Metadata } from "next"
import { Layers } from "lucide-react"
import { getAllSeries, getSeriesPosts, SeriesCard } from "@features/series"

export const metadata: Metadata = {
  title: "시리즈",
  description: "주제별로 이어지는 연재 시리즈 모음",
}

export default function SeriesListPage() {
  const allSeries = getAllSeries()

  return (
    <div className="mx-auto w-full max-w-3xl flex flex-col gap-6 py-4">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold mb-1">
          <Layers className="size-6 text-primary" />
          시리즈
        </h1>
        <p className="text-muted-foreground text-sm">
          하나의 주제를 처음부터 끝까지 따라가는 연재 모음입니다
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {allSeries.map((sr) => {
          const seriesPosts = getSeriesPosts(sr.slug)
          const latest = seriesPosts[seriesPosts.length - 1]
          return (
            <SeriesCard
              key={sr.slug}
              slug={sr.slug}
              title={sr.title}
              description={sr.description}
              status={sr.status}
              postCount={seriesPosts.length}
              latestDate={
                latest ? new Date(latest.date).toLocaleDateString("ko-KR") : undefined
              }
            />
          )
        })}
      </div>
    </div>
  )
}
