"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { Button } from "@shared/ui"
import { cn } from "@shared/lib"

interface TocItem {
  id: string
  label: string
}

interface PortfolioHeaderProps {
  toc: TocItem[]
}

export function PortfolioHeader({ toc }: PortfolioHeaderProps) {
  const [activeId, setActiveId] = useState("")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    )

    const sections = toc
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[]

    sections.forEach((el) => observer.observe(el))
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [toc])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md transition-shadow print:hidden",
        scrolled && "shadow-sm"
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-2 sm:gap-4 px-3 sm:px-6 py-2 sm:py-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          aria-label="블로그로 돌아가기"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">블로그</span>
        </Link>

        <nav
          className="relative flex flex-1 items-center gap-1 overflow-x-auto scrollbar-none [mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)] sm:[mask-image:none]"
          aria-label="목차"
        >
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "shrink-0 rounded-md px-2.5 py-1.5 text-xs transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60",
                activeId === item.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* PDF 출력은 데스크톱 전용 (모바일 인쇄 다이얼로그는 사실상 미사용) */}
        <Button
          variant="outline"
          size="sm"
          className="hidden md:inline-flex shrink-0 gap-1.5 text-xs"
          onClick={() => window.print()}
        >
          <Download className="size-3.5" aria-hidden="true" />
          PDF
        </Button>
      </div>
    </header>
  )
}
