import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { AiAssistant } from "@/components/layout/AiAssistant"
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
  title: "Carefree Studio",
  description: "AI 기반 게임 컨셉 생성 및 PRD 빌드 플랫폼",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,900&f[]=general-sans@400,500,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="pt-14">{children}</main>
          <AiAssistant />
        </ThemeProvider>
      </body>
    </html>
  )
}
