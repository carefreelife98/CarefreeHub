"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { BaseSlideProps, HighlightSlideData } from "../../model/types"

export function HighlightSlide({
  data,
  isActive,
  theme = "dark",
}: BaseSlideProps<HighlightSlideData>) {
  const { title, items } = data
  const isDark = theme === "dark"

  return (
    <div className="flex flex-col items-center justify-center text-center px-8 max-w-4xl mx-auto w-full">
      <motion.h2
        className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-12 ${
          isDark ? "text-white" : "text-neutral-900"
        }`}
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
            className={`group relative backdrop-blur-sm rounded-2xl p-6 
              border transition-all duration-300 text-left
              ${
                isDark
                  ? "bg-white/5 border-white/10 hover:border-white/20"
                  : "bg-white border-neutral-200 hover:border-neutral-300 shadow-sm"
              }`}
            initial={{ opacity: 0, y: 30 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 + index * 0.15, duration: 0.6 }}
            whileHover={{ y: -4 }}
          >
            <span className="text-sm text-blue-500 font-medium mb-3 block">{item.label}</span>
            <h3
              className={`text-lg md:text-xl font-semibold mb-2 line-clamp-2 ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              {item.title}
            </h3>
            {item.description && (
              <p
                className={`text-sm mb-3 line-clamp-2 ${isDark ? "text-white/50" : "text-neutral-500"}`}
              >
                {item.description}
              </p>
            )}
            {item.meta && (
              <span className={`text-xs ${isDark ? "text-white/30" : "text-neutral-400"}`}>
                {item.meta}
              </span>
            )}
            {item.link && (
              <Link
                href={item.link}
                className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300
                  ${isDark ? "bg-white/0 group-hover:bg-white/10" : "bg-neutral-100 group-hover:bg-neutral-200"}`}
                onClick={(e) => e.stopPropagation()}
              >
                <ArrowUpRight
                  className={`w-4 h-4 transition-colors ${
                    isDark
                      ? "text-white/50 group-hover:text-white"
                      : "text-neutral-400 group-hover:text-neutral-700"
                  }`}
                />
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
