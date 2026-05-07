"use client"

import { Search } from "lucide-react"
import HeaderNavigationMenu from "./HeaderNavigationMenu"
import { Button, useSidebar, ScrollProgress, CommandShortcut, SidebarTrigger } from "@shared/ui"
import { useEffect, useState } from "react"
import { PostSearchDialog } from "@features/search"

export default function BlogHeader() {
  const { state, isMobile } = useSidebar()
  const isOpen = state === "expanded"
  const [searchOpen, setSearchOpen] = useState(false)
  const [isMac, setIsMac] = useState(true)

  const handleSearch = () => {
    setSearchOpen(true)
  }

  // OS 감지는 SSR/CSR 일관성을 위해 mount 후에만 갱신한다.
  // React 19 react-hooks/set-state-in-effect 룰의 정당한 예외 (외부 환경 상태 동기화).
  useEffect(() => {
    const isMacOS = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMac(isMacOS)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "i" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <div className="w-full flex flex-row justify-between items-center gap-2 px-3 md:px-6 py-2 md:py-0 relative z-50">
      {/* 좌측: 모바일에선 햄버거, 데스크톱에선 워드마크 */}
      <div className="flex flex-row items-center gap-2 min-w-0 md:min-w-32">
        <SidebarTrigger className="md:hidden h-10 w-10 shrink-0" />
        <div
          className={`hidden md:block text-xl font-bold tracking-tight whitespace-nowrap transition-opacity ${isOpen ? "opacity-0" : "opacity-100"} cursor-default`}
          style={{ letterSpacing: "-0.02em" }}
        >
          Carefree Hub
        </div>
        {/* 모바일: 햄버거 옆에 워드마크 (사이드바가 닫힌 상태에서만) */}
        <div
          className="md:hidden text-base font-bold tracking-tight whitespace-nowrap truncate"
          style={{ letterSpacing: "-0.02em" }}
        >
          Carefree Hub
        </div>
      </div>

      {/* 가운데: 데스크톱 전용 NavigationMenu */}
      <div className="hidden md:flex flex-row justify-center items-center">
        <div className="p-2 mx-10">
          <HeaderNavigationMenu />
        </div>
      </div>

      {/* 우측: 검색 */}
      <div className="flex flex-row justify-end items-center md:min-w-32 shrink-0">
        <Button
          variant="ghost"
          size={isMobile ? "icon" : "default"}
          onClick={handleSearch}
          aria-label="검색"
          className="h-10 w-10 md:h-9 md:w-auto"
        >
          <Search className="h-4 w-4" />
          <CommandShortcut className="hidden md:inline-flex">
            {isMac ? "⌘I" : "Ctrl+I"}
          </CommandShortcut>
        </Button>
      </div>
      <PostSearchDialog open={searchOpen} setOpen={setSearchOpen} />
      <ScrollProgress />
    </div>
  )
}
