"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const cycleTheme = () => {
    if (theme === "system") setTheme("light")
    else if (theme === "light") setTheme("dark")
    else setTheme("system")
  }

  const isGentityActive = pathname?.startsWith("/gentity")
  const isBuildityActive = pathname?.startsWith("/buildity")

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-display text-lg font-bold text-foreground tracking-tight">
          CAREFREE <span className="text-primary">STUDIO</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/gentity"
            className={`relative text-sm font-medium transition-colors ${
              isGentityActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Gentity
            {isGentityActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary" />
            )}
          </Link>
          <Link
            href="/buildity"
            className={`relative text-sm font-medium transition-colors ${
              isBuildityActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Buildity
            {isBuildityActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary" />
            )}
          </Link>
          <button
            onClick={cycleTheme}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label={
              mounted
                ? theme === "system"
                  ? "시스템 테마"
                  : theme === "light"
                    ? "라이트 모드"
                    : "다크 모드"
                : "테마 전환"
            }
            title={
              mounted
                ? theme === "system"
                  ? "시스템 테마"
                  : theme === "light"
                    ? "라이트 모드"
                    : "다크 모드"
                : "테마 전환"
            }
          >
            {!mounted ? (
              <MonitorIcon className="size-4" />
            ) : theme === "light" ? (
              <SunIcon className="size-4" />
            ) : theme === "dark" ? (
              <MoonIcon className="size-4" />
            ) : (
              <MonitorIcon className="size-4" />
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
