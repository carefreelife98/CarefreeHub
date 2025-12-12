"use client"

import { useEffect, useRef } from "react"
import { motion, MotionProps, useScroll } from "motion/react"

import { cn } from "@/lib/utils"

interface ScrollProgressProps extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  ref?: React.Ref<HTMLDivElement>
}

export function ScrollProgress({ className, ref, ...props }: ScrollProgressProps) {
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    containerRef.current = document.getElementById("main-content")
  }, [])

  const { scrollYProgress } = useScroll({
    container: containerRef,
  })

  return (
    <motion.div
      ref={ref}
      className={cn(
        "absolute inset-x-0 bottom-0 z-50 h-px origin-left bg-gradient-to-r from-[#A97CF8] via-[#F38CB8] to-[#FDCC92]",
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props}
    />
  )
}
