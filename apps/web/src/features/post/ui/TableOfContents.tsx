"use client"

import { useEffect, useState } from "react"
import { ChevronDown, List, X } from "lucide-react"
import { cn } from "@shared/lib"
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@shared/ui"

interface TocEntry {
  title: string
  url: string
  items: TocEntry[]
}

interface TableOfContentsProps {
  toc: TocEntry[]
  onClose?: () => void
}

interface FlatItem {
  title: string
  url: string
  depth: number
}

function flattenToc(items: TocEntry[], depth = 1): FlatItem[] {
  const result: FlatItem[] = []

  for (const item of items) {
    result.push({ title: item.title, url: item.url, depth })
    if (item.items && item.items.length > 0) {
      result.push(...flattenToc(item.items, depth + 1))
    }
  }

  return result
}

export function TableOfContents({ toc, onClose }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")
  const [isOpen, setIsOpen] = useState(true)
  const flatItems = flattenToc(toc)

  useEffect(() => {
    const scrollContainer = document.getElementById("main-content")
    if (!scrollContainer) return

    // 보이는 heading 요소 찾기 (중복 id 처리)
    const findVisibleElement = (id: string): HTMLElement | null => {
      const elements = document.querySelectorAll(`[id="${id}"]`)
      for (const element of elements) {
        const rect = element.getBoundingClientRect()
        if (rect.height > 0) {
          return element as HTMLElement
        }
      }
      return null
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // 가장 위에 있는 보이는 heading을 active로 설정
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          // 여러 개가 보이면 가장 위에 있는 것 선택
          const topEntry = visibleEntries.reduce((prev, curr) =>
            prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr
          )
          setActiveId(topEntry.target.id)
        }
      },
      {
        root: scrollContainer,
        rootMargin: "-100px 0px -70% 0px",
        threshold: 0,
      }
    )

    // 실제로 보이는 요소만 관찰
    flatItems.forEach((item) => {
      const id = item.url.replace("#", "")
      const el = findVisibleElement(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [flatItems])

  if (flatItems.length === 0) return null

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const scrollContainer = document.getElementById("main-content")

    // 같은 id를 가진 요소가 여러 개 있을 수 있으므로, 실제로 보이는 요소 찾기
    const elements = document.querySelectorAll(`[id="${id}"]`)
    let el: HTMLElement | null = null

    for (const element of elements) {
      const rect = element.getBoundingClientRect()
      // 높이가 있는 (보이는) 요소 찾기
      if (rect.height > 0) {
        el = element as HTMLElement
        break
      }
    }

    if (el && scrollContainer) {
      const elRect = el.getBoundingClientRect()
      const containerRect = scrollContainer.getBoundingClientRect()

      // 요소의 컨테이너 내 상대 위치 = 현재 스크롤 + (요소 top - 컨테이너 top) - 헤더 오프셋
      const targetScroll = scrollContainer.scrollTop + elRect.top - containerRect.top - 100

      scrollContainer.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      })

      setActiveId(id)
    }
  }

  return (
    <div className="w-full rounded-lg border border-border/60 bg-card/50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* 헤더 */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 bg-muted/30">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2 hover:text-foreground transition-colors">
              <List className="size-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium">목차</span>
              <span className="text-xs text-muted-foreground">({flatItems.length})</span>
              <ChevronDown
                className={cn(
                  "size-3.5 text-muted-foreground transition-transform duration-200 shrink-0",
                  isOpen && "rotate-180"
                )}
              />
            </button>
          </CollapsibleTrigger>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 hover:bg-background/80"
              onClick={onClose}
              title="목차 닫기"
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>

        {/* 목차 내용 */}
        <CollapsibleContent>
          <nav className="py-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
            {flatItems.map((item) => {
              const id = item.url.replace("#", "")
              const isActive = activeId === id
              return (
                <a
                  key={item.url}
                  href={item.url}
                  onClick={(e) => handleClick(e, id)}
                  title={item.title}
                  className={cn(
                    "block text-[13px] py-1.5 pr-3 border-l-2 transition-colors hover:text-foreground truncate",
                    item.depth === 1 && "pl-3",
                    item.depth === 2 && "pl-5",
                    item.depth === 3 && "pl-7",
                    isActive
                      ? "border-primary text-primary font-medium bg-primary/5"
                      : "border-transparent text-muted-foreground hover:border-border"
                  )}
                >
                  {item.title}
                </a>
              )
            })}
          </nav>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
