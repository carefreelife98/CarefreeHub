"use client"

/**
 * 스크롤 깊이 추적 훅
 * @features/analytics/hooks/use-scroll-tracking
 */

import { useEffect, useRef } from "react"
import { isAnalyticsEnabled } from "@shared/config/analytics"
import { trackScrollDepth } from "../lib/track-events"

/**
 * 스크롤 깊이 마일스톤 (25%, 50%, 75%, 100%) 추적
 * @param postSlug - 포스트 식별자 (선택)
 */
export function useScrollTracking(postSlug?: string) {
  const milestones = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (!isAnalyticsEnabled()) return

    const scrollContainer = document.getElementById("main-content")
    if (!scrollContainer) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer
      const maxScroll = scrollHeight - clientHeight

      if (maxScroll <= 0) return

      const scrollPercent = Math.round((scrollTop / maxScroll) * 100)
      const checkpoints = [25, 50, 75, 100]

      for (const checkpoint of checkpoints) {
        if (scrollPercent >= checkpoint && !milestones.current.has(checkpoint)) {
          milestones.current.add(checkpoint)
          trackScrollDepth({ depth: checkpoint, postSlug })
        }
      }
    }

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true })
    return () => scrollContainer.removeEventListener("scroll", handleScroll)
  }, [postSlug])

  // 페이지 변경 시 마일스톤 리셋
  useEffect(() => {
    milestones.current.clear()
  }, [postSlug])
}
