"use client"

/**
 * 외부 링크 클릭 자동 추적 훅
 * @features/analytics/hooks/use-external-link-tracking
 */

import { useEffect } from "react"
import { isAnalyticsEnabled } from "@shared/config/analytics"
import { trackExternalLinkClick } from "../lib/track-events"

/**
 * 외부 도메인 링크 클릭 자동 감지 및 추적
 */
export function useExternalLinkTracking() {
  useEffect(() => {
    if (!isAnalyticsEnabled()) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest("a")

      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href) return

      // 외부 링크 판별
      try {
        const url = new URL(href, window.location.origin)
        if (url.origin !== window.location.origin) {
          trackExternalLinkClick({
            url: href,
            text: anchor.textContent || undefined,
          })
        }
      } catch {
        // 유효하지 않은 URL은 무시
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])
}
