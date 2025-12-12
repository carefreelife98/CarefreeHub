"use client"

import {
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  Sidebar,
  useSidebar,
} from "@/components/ui/sidebar"
import AppSidebarHeader from "./header/AppSidebarHeader"
import AppSidebarFooter from "./footer/AppSidebarFooter"
import { CategoryNav } from "./content/CategoryNav"
import Logo from "../icons/Logo"
import { SidebarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar()
  const isExpanded = state === "expanded"
  const router = useRouter()
  return (
    <Sidebar collapsible="icon" className="">
      <SidebarHeader className="flex flex-col">
        <div
          className={`flex flex-row items-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isExpanded ? "justify-between" : "justify-center"}`}
        >
          {/* Logo - GPU 가속 transform + opacity 사용 */}
          <div
            className={`overflow-hidden will-change-transform transition-[width,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center gap-2 h-8 hover:cursor-pointer ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"}`}
            onClick={() => router.push("/")}
          >
            <Logo
              className={`w-8 h-8 shrink-0 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] transform-gpu ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
            />
            <div className="text-xl font-bold whitespace-nowrap">Carefree Hub</div>
          </div>

          {/* Toggle Button - 아이콘 크로스페이드 */}
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="relative shrink-0 will-change-transform transform-gpu"
          >
            <SidebarIcon
              className={`absolute inset-0 m-auto transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] transform-gpu
                ${isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            />
            <Logo
              className={`w-5 h-5 absolute inset-0 m-auto transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] transform-gpu
                ${isExpanded ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
            />
          </Button>
        </div>

        {/* Header Content - grid 기반 높이 애니메이션 (GPU 가속) */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-[grid-template-rows]
            ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="overflow-hidden transform-gpu">
            <AppSidebarHeader />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <CategoryNav />
      </SidebarContent>

      {/* Footer - 동일한 grid 패턴 */}
      <SidebarFooter>
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-[grid-template-rows]
            ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="overflow-hidden transform-gpu">
            <AppSidebarFooter />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
