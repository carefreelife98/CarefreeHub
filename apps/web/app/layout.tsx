import type { Metadata } from "next";
import "./globals.css";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/sidebar/AppSidebar";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.meta.title,
  description: siteConfig.meta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <main>
              {/* <SidebarTrigger /> */}
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        </body>
    </html>
  );
}
