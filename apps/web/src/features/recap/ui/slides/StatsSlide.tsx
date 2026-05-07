"use client"

import { motion, useMotionValue, useTransform, animate } from "motion/react"
import { useEffect } from "react"
import { cn } from "@shared/lib"
import type { BaseSlideProps, StatsSlideData } from "../../model/types"

function AnimatedNumber({ value, isActive }: { value: number | string; isActive: boolean }) {
  const numericValue = typeof value === "number" ? value : parseInt(value.replace(/,/g, ""), 10)
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) => Math.round(latest).toLocaleString())

  useEffect(() => {
    if (isActive && !isNaN(numericValue)) {
      const controls = animate(motionValue, numericValue, {
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
      })
      return controls.stop
    }
  }, [isActive, numericValue, motionValue])

  if (isNaN(numericValue)) {
    return <span>{value}</span>
  }

  return <motion.span className="tabular-nums">{rounded}</motion.span>
}

export function StatsSlide({ data, isActive, theme = "dark" }: BaseSlideProps<StatsSlideData>) {
  const { title, stats } = data
  const wrapperTheme = theme === "light" ? "" : "dark"

  return (
    <div
      className={cn(
        wrapperTheme,
        "flex flex-col items-center justify-center text-center px-8 max-w-4xl mx-auto text-foreground"
      )}
    >
      <motion.h2
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-16 text-foreground tracking-tight break-keep"
        style={{ letterSpacing: "-0.02em" }}
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {title}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={cn(
              "flex flex-col items-center p-6 rounded-2xl",
              stat.highlight && "bg-foreground/10 backdrop-blur-sm"
            )}
            initial={{ opacity: 0, y: 30 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 + index * 0.15, duration: 0.6 }}
          >
            <div className="flex items-baseline gap-1">
              {stat.prefix && (
                <span className="text-2xl md:text-3xl text-foreground/60">{stat.prefix}</span>
              )}
              <span
                className={cn(
                  "text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight",
                  stat.highlight ? "text-primary" : "text-foreground/90"
                )}
                style={{ letterSpacing: "-0.03em" }}
              >
                <AnimatedNumber value={stat.value} isActive={isActive} />
              </span>
              {stat.suffix && (
                <span className="text-2xl md:text-3xl ml-1 text-foreground/60">{stat.suffix}</span>
              )}
            </div>
            <span className="text-lg md:text-xl mt-3 font-medium text-foreground/50 break-keep">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
