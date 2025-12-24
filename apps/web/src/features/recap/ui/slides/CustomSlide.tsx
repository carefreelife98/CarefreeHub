"use client"

import { motion } from "motion/react"
import type { BaseSlideProps, CustomSlideData } from "../../model/types"

/**
 * 커스텀 슬라이드
 * 원하는 React 컴포넌트를 자유롭게 렌더링할 수 있습니다.
 */
export function CustomSlide({ data, isActive }: BaseSlideProps<CustomSlideData>) {
  const { title, content } = data

  return (
    <div className="flex flex-col items-center justify-center text-center px-8 max-w-4xl mx-auto w-full">
      {title && (
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {title}
        </motion.h2>
      )}

      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {content}
      </motion.div>
    </div>
  )
}
