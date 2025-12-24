"use client"

import { motion } from "motion/react"
import type { SlideTheme } from "../model/types"

interface RecapNavigationProps {
  theme?: SlideTheme
}

export function RecapNavigation({ theme = "dark" }: RecapNavigationProps) {
  const isDark = theme === "dark"

  return (
    <motion.div
      className={`mt-16 flex items-center gap-2 text-sm ${
        isDark ? "text-white/40" : "text-neutral-400"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <kbd className={`px-2 py-1 rounded text-xs ${isDark ? "bg-white/10" : "bg-neutral-200"}`}>
        ←
      </kbd>
      <span>또는</span>
      <kbd className={`px-2 py-1 rounded text-xs ${isDark ? "bg-white/10" : "bg-neutral-200"}`}>
        →
      </kbd>
      <span>키로 이동</span>
    </motion.div>
  )
}
