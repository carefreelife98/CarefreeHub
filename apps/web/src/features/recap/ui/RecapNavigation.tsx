"use client"

import { motion } from "motion/react"

export function RecapNavigation() {
  return (
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
  )
}
