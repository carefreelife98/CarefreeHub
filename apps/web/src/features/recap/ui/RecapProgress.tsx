"use client"

import { motion } from "motion/react"
import type { SlideTheme } from "../model/types"

interface RecapProgressProps {
  currentIndex: number
  totalSlides: number
  onGoTo: (index: number) => void
  theme?: SlideTheme
}

export function RecapProgress({
  currentIndex,
  totalSlides,
  onGoTo,
  theme = "dark",
}: RecapProgressProps) {
  const isDark = theme === "dark"

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 
        flex items-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onGoTo(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer
            ${
              index === currentIndex
                ? isDark
                  ? "bg-white w-6"
                  : "bg-neutral-800 w-6"
                : isDark
                  ? "bg-white/30 hover:bg-white/50"
                  : "bg-neutral-400/50 hover:bg-neutral-500"
            }`}
          aria-label={`슬라이드 ${index + 1}로 이동`}
        />
      ))}
    </motion.div>
  )
}
