"use client"

import { motion } from "motion/react"
import type { BaseSlideProps, IntroSlideData } from "../../model/types"

export function IntroSlide({ data, isActive }: BaseSlideProps<IntroSlideData>) {
  const { year, title, subtitle } = data

  return (
    <div className="flex flex-col items-center justify-center text-center px-8 max-w-3xl mx-auto">
      <motion.div
        className="text-white/60 text-lg md:text-xl tracking-widest font-light mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        RECAP
      </motion.div>

      <motion.h1
        className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {year}
      </motion.h1>

      <motion.h2
        className="text-2xl md:text-3xl lg:text-4xl font-medium text-white/90 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          className="text-lg md:text-xl text-white/50 font-light"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {subtitle}
        </motion.p>
      )}

      <motion.div
        className="mt-12 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-white/30 text-sm">스와이프하여 시작</span>
      </motion.div>
    </div>
  )
}
