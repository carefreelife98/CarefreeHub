import Link from "next/link"
import { ChevronDown, ChevronLeft, ChevronRight, Layers } from "lucide-react"
import { cn } from "@shared/lib"
import type { SeriesNavData } from "../lib/series"

/** 포스트 상세 상단의 시리즈 내비게이션 (회차 표시 + 이전/다음 + 전체 회차 목록) */
export function SeriesNav({ nav, currentSlug }: { nav: SeriesNavData; currentSlug: string }) {
  return (
    <div className="mb-8 rounded-lg border border-border bg-muted/30">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 [&::-webkit-details-marker]:hidden">
          <Layers className="size-4 shrink-0 text-primary" />
          <span className="text-sm font-medium">
            <Link
              href={`/series/${nav.slug}`}
              className="hover:text-primary hover:underline underline-offset-4"
            >
              {nav.title}
            </Link>
          </span>
          <span className="text-xs text-muted-foreground">
            {nav.current + 1} / {nav.items.length}편
          </span>
          <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <ol className="border-t border-border px-4 py-2">
          {nav.items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/posts/${item.slug}`}
                className={cn(
                  "flex items-baseline gap-2 py-1.5 text-sm transition-colors",
                  item.slug === currentSlug
                    ? "font-medium text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={item.slug === currentSlug ? "page" : undefined}
              >
                <span className="w-6 shrink-0 text-right text-xs tabular-nums">{item.order}.</span>
                <span className="line-clamp-1">{item.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </details>
      {(nav.prev || nav.next) && (
        <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-2 text-sm">
          {nav.prev ? (
            <Link
              href={`/posts/${nav.prev.slug}`}
              className="flex min-w-0 items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="size-4 shrink-0" />
              <span className="line-clamp-1">{nav.prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {nav.next ? (
            <Link
              href={`/posts/${nav.next.slug}`}
              className="flex min-w-0 items-center gap-1 text-right text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="line-clamp-1">{nav.next.title}</span>
              <ChevronRight className="size-4 shrink-0" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  )
}
