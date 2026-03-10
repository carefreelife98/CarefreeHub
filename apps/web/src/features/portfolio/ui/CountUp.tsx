"use client"

import { useEffect, useRef, useState } from "react"

interface CountUpProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
}

export function CountUp({
  end,
  duration = 1.5,
  suffix = "",
  prefix = "",
  decimals = 0,
}: CountUpProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startTime = performance.now()
          const durationMs = duration * 1000

          function animate(currentTime: number) {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / durationMs, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(eased * end)

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString()

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      <span className="print:hidden">{formatted}</span>
      <span className="hidden print:inline">
        {decimals > 0 ? end.toFixed(decimals) : end.toLocaleString()}
      </span>
      {suffix}
    </span>
  )
}
