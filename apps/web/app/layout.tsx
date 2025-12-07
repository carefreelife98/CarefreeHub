import type { Metadata } from "next"
import "./globals.css"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/common/sidebar/AppSidebar"
import { siteConfig } from "@/config/site"
import BlogHeader from "@/components/common/header/BlogHeader"
import { Toaster } from "@/components/ui/sonner"
import { ScrollArea } from "@/components/ui/scroll-area"

export const metadata: Metadata = {
  title: siteConfig.meta.title,
  description: siteConfig.meta.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="flex flex-col h-screen">
            <header className="sticky top-0 z-30 bg-background">
              <BlogHeader />
            </header>
            <main id="main-content" className="flex-1 overflow-auto">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  )
}
