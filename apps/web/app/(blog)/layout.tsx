import { SidebarInset, SidebarProvider } from "@shared/ui"
import { AppSidebar } from "@features/sidebar"
import { BlogHeader } from "@widgets/header"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen max-h-screen min-w-0">
        <header className="sticky top-0 z-30 bg-background">
          <BlogHeader />
        </header>
        <main id="main-content" className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
