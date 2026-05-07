"use client"

import { motion } from "motion/react"
import { Share2, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@shared/lib"
import type { BaseSlideProps, OutroSlideData } from "../../model/types"

export function OutroSlide({ data, isActive, theme = "dark" }: BaseSlideProps<OutroSlideData>) {
  const { title, subtitle, message, showShareButton } = data
  const wrapperTheme = theme === "light" ? "" : "dark"

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Year Recap",
          text: subtitle,
          url: window.location.href,
        })
      } catch {
        // 사용자가 공유 취소
      }
    } else {
      // 클립보드에 복사
      await navigator.clipboard.writeText(window.location.href)
      alert("링크가 복사되었습니다!")
    }
  }

  return (
    <div
      className={cn(
        wrapperTheme,
        "flex flex-col items-center justify-center text-center px-8 max-w-3xl mx-auto text-foreground"
      )}
    >
      <motion.div
        className="text-6xl mb-8"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      >
        🎉
      </motion.div>

      <motion.h2
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground tracking-tight break-keep"
        style={{ letterSpacing: "-0.025em" }}
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          className="text-xl md:text-2xl mb-4 text-foreground/70 break-keep"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {subtitle}
        </motion.p>
      )}

      {message && (
        <motion.p
          className="text-lg mb-12 text-foreground/50 break-keep"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {message}
        </motion.p>
      )}

      <motion.div
        className="flex flex-col sm:flex-row items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1, duration: 0.6 }}
      >
        {showShareButton && (
          <motion.button
            className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60"
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="w-5 h-5" aria-hidden="true" />
            공유하기
          </motion.button>
        )}

        <Link href="/">
          <motion.button
            className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg border bg-foreground/10 text-foreground border-foreground/20 hover:bg-foreground/20 transition-colors duration-200 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5" aria-hidden="true" />
            닫기
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}
