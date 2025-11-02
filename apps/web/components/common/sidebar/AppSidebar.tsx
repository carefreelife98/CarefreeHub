'use client'

import { SidebarContent, SidebarHeader, SidebarMenuButton, SidebarMenuItem, SidebarMenu, SidebarTrigger, SidebarFooter, SidebarGroup, Sidebar, useSidebar } from "@/components/ui/sidebar";
import { useState } from "react";
import AppSidebarHeader from "./header/AppSidebarHeader";
import AppSidebarFooter from "./footer/AppSidebarFooter";
import Logo from "../icons/Logo";
import { SidebarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar()
  const [isHovering, setIsHovering] = useState(false);
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-col">
        <div className="flex flex-row items-center justify-between">
          {state === "expanded" && <Logo className="w-8 h-8" />}
          <Button onClick={toggleSidebar} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} variant="ghost" size="icon">
            {state === "expanded" ? <SidebarIcon /> : isHovering ? <SidebarIcon /> : <Logo className="w-8 h-8" />}
          </Button>
        </div>
        {state === "expanded" && <AppSidebarHeader />}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        {state === "expanded" && <AppSidebarFooter />}
      </SidebarFooter>
    </Sidebar>
  )
}