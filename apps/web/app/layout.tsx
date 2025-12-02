import type { Metadata } from "next"
import "./globals.css"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/common/sidebar/AppSidebar"
import { siteConfig } from "@/config/site"
import BlogHeader from "@/components/common/header/BlogHeader"
import { Toaster } from "@/components/ui/sonner"

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
          <SidebarInset>
            <main>
              <BlogHeader />
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  )
}
