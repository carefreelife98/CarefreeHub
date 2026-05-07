"use client"

import { motion } from "motion/react"
import { cn } from "@shared/lib"
import type { BaseSlideProps, IntroSlideData } from "../../model/types"
import { RecapNavigation } from "../RecapNavigation"
import { useIsMobile } from "@/src/shared/hooks"

export function IntroSlide({ data, isActive, theme = "dark" }: BaseSlideProps<IntroSlideData>) {
  const { year, title, subtitle } = data
  const isMobile = useIsMobile()
  const wrapperTheme = theme === "light" ? "" : "dark"

  return (
    <div
      className={cn(
        wrapperTheme,
        "flex flex-col items-center justify-center text-center px-8 max-w-3xl mx-auto text-foreground"
      )}
    >
      <motion.div
        className="text-foreground/60 text-lg md:text-xl tracking-widest font-light mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        RECAP
      </motion.div>

      <motion.h1
        className="text-6xl md:text-8xl lg:text-9xl font-bold text-foreground mb-6 tabular-nums"
        style={{ letterSpacing: "-0.04em" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {year}
      </motion.h1>

      <motion.h2
        className="text-2xl md:text-3xl lg:text-4xl font-medium text-foreground/90 mb-4 break-keep"
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          className="text-lg md:text-xl text-foreground/50 font-light break-keep"
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
            className="text-sm font-light tracking-wide text-foreground/40"
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
