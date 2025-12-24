"use client"

import { motion } from "motion/react"

interface RecapProgressProps {
  currentIndex: number
  totalSlides: number
  onGoTo: (index: number) => void
}

export function RecapProgress({ currentIndex, totalSlides, onGoTo }: RecapProgressProps) {
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
            ${index === currentIndex ? "bg-white w-6" : "bg-white/30 hover:bg-white/50"}`}
          aria-label={`슬라이드 ${index + 1}로 이동`}
        />
      ))}
    </motion.div>
  )
}
