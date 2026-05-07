"use client"

import { motion } from "motion/react"
import { cn } from "@shared/lib"
import type { SlideTheme } from "../model/types"

interface RecapNavigationProps {
  theme?: SlideTheme
}

export function RecapNavigation({ theme = "dark" }: RecapNavigationProps) {
  const wrapperTheme = theme === "light" ? "" : "dark"

  return (
    <motion.div
      className={cn(
        wrapperTheme,
        "mt-16 flex items-center gap-2 text-sm text-foreground/40"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <kbd className="px-2 py-1 rounded text-xs bg-foreground/10">←</kbd>
      <span>또는</span>
      <kbd className="px-2 py-1 rounded text-xs bg-foreground/10">→</kbd>
      <span>키로 이동</span>
    </motion.div>
  )
}
