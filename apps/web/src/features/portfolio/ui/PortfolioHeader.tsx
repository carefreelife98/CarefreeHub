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
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">블로그</span>
        </Link>

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto scrollbar-none">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "shrink-0 rounded-md px-2.5 py-1 text-xs transition-colors",
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

        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5 text-xs"
          onClick={() => window.print()}
        >
          <Download className="size-3.5" />
          PDF
        </Button>
      </div>
    </header>
  )
}
