"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import type { RecapConfig, SlideConfig, BaseSlideProps } from "../model/types"
import { RecapProgress } from "./RecapProgress"

interface RecapContainerProps {
  config: RecapConfig
}

export function RecapContainer({ config }: RecapContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const { slides } = config
  const totalSlides = slides.length
  const currentSlide = slides[currentIndex]

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSlides) {
        setDirection(index > currentIndex ? 1 : -1)
        setCurrentIndex(index)
      }
    },
    [currentIndex, totalSlides]
  )

  const goNext = useCallback(() => {
    if (currentIndex < totalSlides - 1) {
      setDirection(1)
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, totalSlides])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex((prev) => prev - 1)
    }
  }, [currentIndex])

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
        goNext()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        goPrev()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goNext, goPrev])

  // 터치 스와이프
  useEffect(() => {
    let touchStartX = 0
    let touchEndX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX
      const diff = touchStartX - touchEndX

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goNext()
        } else {
          goPrev()
        }
      }
    }

    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [goNext, goPrev])

  const getBackgroundStyle = (slide: SlideConfig<unknown>) => {
    if (!slide.background) {
      return { background: "#0f0f0f" }
    }

    switch (slide.background.type) {
      case "gradient":
        return { background: slide.background.gradient }
      case "solid":
        return { background: slide.background.color }
      case "image":
        return {
          backgroundImage: `url(${slide.background.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      default:
        return { background: "#0f0f0f" }
    }
  }

  const getAnimationVariants = (slide: SlideConfig<unknown>) => {
    const animation = slide.animation ?? { enter: "fade", duration: 0.5 }

    const variants = {
      enter: {} as Record<string, number>,
      center: { x: 0, y: 0, opacity: 1, scale: 1 },
      exit: {} as Record<string, number>,
    }

    switch (animation.enter) {
      case "slide-up":
        variants.enter = { y: 50, opacity: 0 }
        variants.exit = { y: -50, opacity: 0 }
        break
      case "slide-left":
        variants.enter = { x: direction > 0 ? 100 : -100, opacity: 0 }
        variants.exit = { x: direction > 0 ? -100 : 100, opacity: 0 }
        break
      case "scale":
        variants.enter = { scale: 0.8, opacity: 0 }
        variants.exit = { scale: 1.2, opacity: 0 }
        break
      case "fade":
      default:
        variants.enter = { opacity: 0 }
        variants.exit = { opacity: 0 }
    }

    return variants
  }

  const SlideComponent = currentSlide.component as React.ComponentType<BaseSlideProps<unknown>>

  // 화면 탭 핸들러 (좌측: 이전, 우측: 다음)
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement
      // 버튼이나 링크 클릭 시 무시
      if (target.closest("button") || target.closest("a") || target.closest('[role="button"]')) {
        return
      }

      const { clientX } = e
      const { innerWidth } = window
      const clickPosition = clientX / innerWidth

      if (clickPosition < 0.3) {
        goPrev()
      } else if (clickPosition > 0.7) {
        goNext()
      } else {
        // 중앙 탭 시 다음으로
        goNext()
      }
    },
    [goNext, goPrev]
  )

  return (
    <div
      className="fixed inset-0 overflow-hidden z-50 bg-[#0f0f0f] cursor-pointer"
      onClick={handleClick}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentSlide.id}
          className="absolute inset-0 flex items-center justify-center"
          style={getBackgroundStyle(currentSlide)}
          variants={getAnimationVariants(currentSlide)}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: currentSlide.animation?.duration ?? 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <SlideComponent
            data={currentSlide.data}
            isActive={true}
            index={currentIndex}
            totalSlides={totalSlides}
            theme={currentSlide.theme ?? "dark"}
            onNext={goNext}
            onPrev={goPrev}
            onGoTo={goToSlide}
          />
        </motion.div>
      </AnimatePresence>

      {/* 프로그레스 */}
      <RecapProgress
        currentIndex={currentIndex}
        totalSlides={totalSlides}
        onGoTo={goToSlide}
        theme={currentSlide.theme ?? "dark"}
      />
    </div>
  )
}
