"use client"

import { ReactNode, useState, useRef, useEffect } from "react"
import { List } from "lucide-react"
import { TableOfContents } from "./TableOfContents"
import { Button } from "@/components/ui/button"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import type { ImperativePanelHandle } from "react-resizable-panels"

interface TocEntry {
  title: string
  url: string
  items: TocEntry[]
}

interface ResizablePostLayoutProps {
  children: ReactNode
  toc: TocEntry[]
}

export function ResizablePostLayout({ children, toc }: ResizablePostLayoutProps) {
  const [isTocVisible, setIsTocVisible] = useState(true)
  const [tocWidth, setTocWidth] = useState(0)
  const tocPanelRef = useRef<ImperativePanelHandle>(null)
  const tocContainerRef = useRef<HTMLDivElement>(null)
  const hasToc = toc && toc.length > 0

  // TOC 패널의 실제 width 측정
  useEffect(() => {
    if (!tocContainerRef.current) return

    const updateWidth = () => {
      if (tocContainerRef.current) {
        setTocWidth(tocContainerRef.current.offsetWidth)
      }
    }

    updateWidth()

    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(tocContainerRef.current)

    return () => resizeObserver.disconnect()
  }, [isTocVisible])

  if (!hasToc) {
    return <article className="max-w-4xl">{children}</article>
  }

  // TOC 숨김 상태
  if (!isTocVisible) {
    return (
      <div className="relative">
        <article>{children}</article>
        <div className="hidden xl:block fixed right-6 top-24 z-10">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full shadow-md bg-background"
            onClick={() => setIsTocVisible(true)}
            title="목차 열기"
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* xl 미만: TOC 없이 본문만 */}
      <div className="xl:hidden">
        <article>{children}</article>
      </div>

      {/* xl 이상: Resizable 레이아웃 */}
      <div className="hidden xl:block">
        <ResizablePanelGroup direction="horizontal" className="min-h-[50vh]">
          {/* 본문 패널 */}
          <ResizablePanel defaultSize={75} minSize={50}>
            <article className="pr-6">{children}</article>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* TOC 패널 */}
          <ResizablePanel ref={tocPanelRef} defaultSize={25} minSize={15} maxSize={35}>
            {/* width 측정용 컨테이너 */}
            <div ref={tocContainerRef} className="h-0 w-full" />

            {/* fixed TOC - 측정된 width 적용 */}
            <div
              className="fixed top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pl-6"
              style={{ width: tocWidth > 0 ? `${tocWidth}px` : "auto" }}
            >
              <TableOfContents toc={toc} onClose={() => setIsTocVisible(false)} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  )
}
