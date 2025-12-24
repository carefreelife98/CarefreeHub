"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { BaseSlideProps, HighlightSlideData } from "../../model/types"

export function HighlightSlide({ data, isActive }: BaseSlideProps<HighlightSlideData>) {
  const { title, items } = data

  return (
    <div className="flex flex-col items-center justify-center text-center px-8 max-w-4xl mx-auto w-full">
      <motion.h2
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-12"
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
            className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 
              border border-white/10 hover:border-white/20 transition-all duration-300
              text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 + index * 0.15, duration: 0.6 }}
            whileHover={{ y: -4 }}
          >
            <span className="text-sm text-blue-400 font-medium mb-3 block">{item.label}</span>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2 line-clamp-2">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-sm text-white/50 mb-3 line-clamp-2">{item.description}</p>
            )}
            {item.meta && <span className="text-xs text-white/30">{item.meta}</span>}
            {item.link && (
              <Link
                href={item.link}
                className="absolute top-4 right-4 p-2 rounded-full 
                  bg-white/0 group-hover:bg-white/10 transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
