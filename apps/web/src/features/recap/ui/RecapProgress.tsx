"use client"

import { motion } from "motion/react"
import { cn } from "@shared/lib"
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
  // 슬라이드 surface가 라이트로 잡힐 때만 라이트 모드로 toggle.
  // 토큰 자체는 layout의 .dark 클래스를 따른다.
  const wrapperTheme = theme === "light" ? "" : "dark"

  return (
    <motion.div
      className={cn(
        wrapperTheme,
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onGoTo(index)}
          className={cn(
            "h-2 rounded-full transition-all duration-300 motion-reduce:transition-none cursor-pointer",
            index === currentIndex
              ? "w-6 bg-foreground"
              : "w-2 bg-foreground/30 hover:bg-foreground/60"
          )}
          aria-label={`슬라이드 ${index + 1}로 이동`}
          aria-current={index === currentIndex ? "true" : undefined}
        />
      ))}
    </motion.div>
  )
}
