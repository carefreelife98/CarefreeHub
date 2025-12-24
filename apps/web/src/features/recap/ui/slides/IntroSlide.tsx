"use client"

import { motion } from "motion/react"
import type { BaseSlideProps, IntroSlideData } from "../../model/types"
import { RecapNavigation } from "../RecapNavigation"
import { useIsMobile } from "@/src/shared/hooks"

export function IntroSlide({ data, isActive, theme = "dark" }: BaseSlideProps<IntroSlideData>) {
  const { year, title, subtitle } = data
  const isMobile = useIsMobile()
  const isDark = theme === "dark"

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
      {isMobile ? (
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.span
            className={`text-sm font-light tracking-wide ${
              isDark ? "text-white/40" : "text-neutral-400"
            }`}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            화면을 탭하여 시작
          </motion.span>
        </motion.div>
      ) : (
        <RecapNavigation theme={theme} />
      )}
    </div>
  )
}
