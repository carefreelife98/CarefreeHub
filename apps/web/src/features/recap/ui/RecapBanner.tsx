"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"

interface RecapBannerProps {
  year: number
}

export function RecapBanner({ year }: RecapBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <Link href={`/recap/${year}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-[oklch(0.18_0.01_50)] border border-foreground/10 hover:border-foreground/20 transition-colors duration-300 motion-reduce:transition-none">
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[oklch(0.85_0.13_75)] text-xs sm:text-sm font-medium tracking-[0.2em] uppercase">
                  {year} Recap
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[oklch(0.96_0.005_60)] mb-2 break-keep">
                올해 개발자 채승민의 성장 기록
              </h3>
              <p className="text-[oklch(0.96_0.005_60)]/60 text-sm break-keep">
                한 해를 회고하고 내년을 준비합니다
              </p>
            </div>

            <div
              className="flex-shrink-0 p-3 rounded-full bg-foreground/10 group-hover:bg-foreground/20 transition-colors motion-reduce:transition-none"
              aria-hidden="true"
            >
              <ArrowRight className="w-6 h-6 text-[oklch(0.96_0.005_60)]" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
