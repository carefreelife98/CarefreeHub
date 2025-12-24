"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Sparkles } from "lucide-react"

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
        <div
          className="relative overflow-hidden rounded-2xl p-6 md:p-8
            bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
            border border-white/10 hover:border-white/20 transition-all duration-300"
        >
          {/* 배경 장식 */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
            <div
              className="absolute inset-0 bg-gradient-to-l from-blue-500/30 to-transparent"
              style={{
                maskImage: "linear-gradient(to left, black, transparent)",
                WebkitMaskImage: "linear-gradient(to left, black, transparent)",
              }}
            />
          </div>

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-amber-400 text-sm font-medium tracking-wider">
                  {year} RECAP
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                올해 개발자 채승민의 성장 기록
              </h3>
              <p className="text-white/60 text-sm">한 해를 회고하고 내년을 준비합니다</p>
            </div>

            <motion.div
              className="flex-shrink-0 p-3 rounded-full bg-white/10 
                group-hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1, x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowRight className="w-6 h-6 text-white" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
