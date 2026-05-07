"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@shared/lib"
import type { BaseSlideProps, HighlightSlideData } from "../../model/types"

export function HighlightSlide({
  data,
  isActive,
  theme = "dark",
}: BaseSlideProps<HighlightSlideData>) {
  const { title, items } = data
  const wrapperTheme = theme === "light" ? "" : "dark"

  return (
    <div
      className={cn(
        wrapperTheme,
        "flex flex-col items-center justify-center text-center px-8 max-w-4xl mx-auto w-full text-foreground"
      )}
    >
      <motion.h2
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-foreground tracking-tight break-keep"
        style={{ letterSpacing: "-0.02em" }}
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {title}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            className="group relative backdrop-blur-sm rounded-2xl p-6 border bg-foreground/5 border-foreground/10 hover:border-foreground/20 transition-colors duration-300 motion-reduce:transition-none text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 + index * 0.15, duration: 0.6 }}
            whileHover={{ y: -4 }}
          >
            <span className="text-sm text-primary font-medium mb-3 block tracking-wide uppercase">
              {item.label}
            </span>
            <h3 className="text-lg md:text-xl font-semibold mb-2 line-clamp-2 text-foreground tracking-tight break-keep">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-sm mb-3 line-clamp-2 text-foreground/60 break-keep">
                {item.description}
              </p>
            )}
            {item.meta && (
              <span className="text-xs text-foreground/40">{item.meta}</span>
            )}
            {item.link && (
              <Link
                href={item.link}
                className="absolute top-4 right-4 p-2 rounded-full bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300 motion-reduce:transition-none"
                onClick={(e) => e.stopPropagation()}
                aria-label={`${item.title} 자세히 보기`}
              >
                <ArrowUpRight
                  className="w-4 h-4 text-foreground/50 group-hover:text-foreground transition-colors motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
