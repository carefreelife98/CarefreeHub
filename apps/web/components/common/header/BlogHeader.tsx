"use client"

import { CheckCircleIcon, Search } from "lucide-react"
import HeaderNavigationMenu from "./HeaderNavigationMenu"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { toast } from "sonner"

export default function BlogHeader() {
  const { state } = useSidebar()
  const isOpen = state === "expanded"

  const handleSearch = () => {
    toast.info("검색 기능은 아직 준비중입니다.", {
      description: "최대한 빨리 추가할게요!",
      position: "top-right",
    })
  }

  return (
    <div className="w-full flex flex-row justify-between items-center px-6">
      <div
        className={`text-xl font-bold whitespace-nowrap ${isOpen ? "opacity-0" : "opacity-100"} cursor-default`}
      >
        Carefree Hub
      </div>
      <div className="flex flex-row justify-center items-center">
        <div className="p-2 mx-10">
          <HeaderNavigationMenu />
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={handleSearch}>
        <Search className="h-4 w-4" />
      </Button>
    </div>
  )
}
