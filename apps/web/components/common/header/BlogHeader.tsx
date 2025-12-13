"use client"

import { Search } from "lucide-react"
import HeaderNavigationMenu from "./HeaderNavigationMenu"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { useEffect, useState } from "react"
import { PostSearchDialog } from "../search/PostSearchDialog"
import { CommandShortcut } from "@/components/ui/command"

export default function BlogHeader() {
  const { state } = useSidebar()
  const isOpen = state === "expanded"
  const [searchOpen, setSearchOpen] = useState(false)
  const [isMac, setIsMac] = useState(true)

  const handleSearch = () => {
    setSearchOpen(true)
  }

  useEffect(() => {
    // 클라이언트에서 OS 감지 (userAgent 사용)
    const isMacOS = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
    setIsMac(isMacOS)

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
      <div className="min-w-32 flex flex-row justify-end items-center">
        <Button variant="ghost" onClick={handleSearch}>
          <Search className="h-4 w-4" />
          <CommandShortcut>{isMac ? "⌘I" : "Ctrl+I"}</CommandShortcut>
        </Button>
      </div>
      <PostSearchDialog open={searchOpen} setOpen={setSearchOpen} />
      <ScrollProgress />
    </div>
  )
}
