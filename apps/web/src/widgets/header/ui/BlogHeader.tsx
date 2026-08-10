"use client"

import { Search } from "lucide-react"
import HeaderNavigationMenu from "./HeaderNavigationMenu"
import { Button, useSidebar, ScrollProgress, CommandShortcut, ThemeToggle } from "@shared/ui"
import { useEffect, useState, useSyncExternalStore } from "react"
import { PostSearchDialog } from "@features/search"

const emptySubscribe = () => () => {}

export default function BlogHeader() {
  const { state } = useSidebar()
  const isOpen = state === "expanded"
  const [searchOpen, setSearchOpen] = useState(false)
  // OS 감지 — 서버에서는 Mac으로 가정하고 클라이언트에서 userAgent로 확정
  const isMac = useSyncExternalStore(
    emptySubscribe,
    () => /Mac|iPhone|iPad|iPod/.test(navigator.userAgent),
    () => true
  )

  const handleSearch = () => {
    setSearchOpen(true)
  }

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
    <div className="w-full flex flex-row justify-between items-center px-6 relative z-50">
      <div
        className={`min-w-32 text-xl font-bold whitespace-nowrap ${isOpen ? "opacity-0" : "opacity-100"} cursor-default`}
      >
        Carefree Hub
      </div>
      <div className="flex flex-row justify-center items-center">
        <div className="p-2 mx-10">
          <HeaderNavigationMenu />
        </div>
      </div>
      <div className="min-w-32 flex flex-row justify-end items-center gap-1">
        <Button variant="ghost" onClick={handleSearch}>
          <Search className="h-4 w-4" />
          <CommandShortcut>{isMac ? "⌘I" : "Ctrl+I"}</CommandShortcut>
        </Button>
        <ThemeToggle />
      </div>
      <PostSearchDialog open={searchOpen} setOpen={setSearchOpen} />
      <ScrollProgress />
    </div>
  )
}
