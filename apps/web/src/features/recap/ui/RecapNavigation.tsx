"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "motion/react"

interface RecapNavigationProps {
  currentIndex: number
  totalSlides: number
  onNext: () => void
  onPrev: () => void
}

export function RecapNavigation({
  currentIndex,
  totalSlides,
  onNext,
  onPrev,
}: RecapNavigationProps) {
  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < totalSlides - 1

  return (
    <>
      {/* 이전 버튼 */}
      <motion.button
        className={`fixed left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full 
          bg-white/10 backdrop-blur-sm border border-white/20
          transition-all duration-200
          ${canGoPrev ? "hover:bg-white/20 cursor-pointer" : "opacity-30 cursor-not-allowed"}`}
        onClick={onPrev}
        disabled={!canGoPrev}
        whileHover={canGoPrev ? { scale: 1.1 } : {}}
        whileTap={canGoPrev ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </motion.button>

      {/* 다음 버튼 */}
      <motion.button
        className={`fixed right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full 
          bg-white/10 backdrop-blur-sm border border-white/20
          transition-all duration-200
          ${canGoNext ? "hover:bg-white/20 cursor-pointer" : "opacity-30 cursor-not-allowed"}`}
        onClick={onNext}
        disabled={!canGoNext}
        whileHover={canGoNext ? { scale: 1.1 } : {}}
        whileTap={canGoNext ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </motion.button>

      {/* 키보드 힌트 */}
      <motion.div
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 
          flex items-center gap-2 text-white/40 text-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <kbd className="px-2 py-1 bg-white/10 rounded text-xs">←</kbd>
        <span>또는</span>
        <kbd className="px-2 py-1 bg-white/10 rounded text-xs">→</kbd>
        <span>키로 이동</span>
      </motion.div>
    </>
  )
}
