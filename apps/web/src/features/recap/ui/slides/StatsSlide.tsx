"use client"

import { motion, useMotionValue, useTransform, animate } from "motion/react"
import { useEffect } from "react"
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

  return <motion.span>{rounded}</motion.span>
}

export function StatsSlide({ data, isActive }: BaseSlideProps<StatsSlideData>) {
  const { title, stats } = data

  return (
    <div className="flex flex-col items-center justify-center text-center px-8 max-w-4xl mx-auto">
      <motion.h2
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-16"
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
            className={`flex flex-col items-center p-6 rounded-2xl
              ${stat.highlight ? "bg-white/10 backdrop-blur-sm" : ""}`}
            initial={{ opacity: 0, y: 30 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 + index * 0.15, duration: 0.6 }}
          >
            <div className="flex items-baseline gap-1">
              {stat.prefix && (
                <span className="text-2xl md:text-3xl text-white/60">{stat.prefix}</span>
              )}
              <span
                className={`text-5xl md:text-6xl lg:text-7xl font-bold
                  ${stat.highlight ? "text-white" : "text-white/90"}`}
                style={
                  stat.highlight
                    ? {
                        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }
                    : {}
                }
              >
                <AnimatedNumber value={stat.value} isActive={isActive} />
              </span>
              {stat.suffix && (
                <span className="text-2xl md:text-3xl text-white/60 ml-1">{stat.suffix}</span>
              )}
            </div>
            <span className="text-lg md:text-xl text-white/50 mt-3 font-medium">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
