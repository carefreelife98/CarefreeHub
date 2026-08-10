import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Layers } from "lucide-react"
import { Badge } from "@shared/ui"
import { MDXContent } from "@features/post"
import { getAllSeries, getSeriesBySlug, getSeriesPosts } from "@features/series"

export async function generateStaticParams() {
  return getAllSeries().map((sr) => ({ slug: sr.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const sr = getSeriesBySlug(slug)
  if (!sr) return { title: "Series Not Found" }
  return {
    title: sr.title,
    description: sr.description,
  }
}

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const sr = getSeriesBySlug(slug)
  if (!sr) notFound()

  const seriesPosts = getSeriesPosts(slug)

  return (
    <div className="mx-auto w-full max-w-3xl flex flex-col gap-6 py-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Layers className="size-5 text-primary" />
          <Badge variant="secondary" className="border-0 text-xs">
            {sr.status === "ongoing" ? "연재중" : sr.status === "completed" ? "완결" : "연재 예정"}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold mb-2">{sr.title}</h1>
        <p className="text-muted-foreground">{sr.description}</p>
      </div>

      <MDXContent code={sr.code} />

      <div className="rounded-xl border border-border">
        <div className="border-b border-border px-5 py-3 text-sm font-medium">
          전체 회차 {seriesPosts.length > 0 && `(${seriesPosts.length}편)`}
        </div>
        {seriesPosts.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            첫 회차를 준비하고 있습니다 ✍️
          </p>
        ) : (
          <ol>
            {seriesPosts.map((post) => (
              <li key={post.slug} className="border-b border-border last:border-b-0">
                <Link
                  href={`/posts/${post.slug}`}
                  className="flex items-baseline gap-3 px-5 py-3.5 transition-colors hover:bg-muted/50"
                >
                  <span className="w-6 shrink-0 text-right text-sm font-semibold tabular-nums text-primary">
                    {post.seriesOrder}
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-medium line-clamp-1">{post.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.date).toLocaleDateString("ko-KR")}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
