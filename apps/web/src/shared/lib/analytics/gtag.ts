/**
 * Google Analytics gtag 래퍼
 * @shared/lib/analytics/gtag
 */

import { gaConfig } from "@shared/config/analytics"

// gtag 타입 정의
type GtagCommand = "config" | "event" | "js" | "set"

interface GtagEventParams {
  page_path?: string
  page_title?: string
  send_page_view?: boolean
  debug_mode?: boolean
  [key: string]: unknown
}

declare global {
  interface Window {
    gtag: (command: GtagCommand, targetId: string, params?: GtagEventParams) => void
    dataLayer: unknown[]
  }
}

/**
 * gtag 안전 호출 래퍼
 * SSR 환경에서 window 객체 접근 방지
 */
export const gtag = (command: GtagCommand, targetId: string, params?: GtagEventParams): void => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(command, targetId, params)
  }
}

/**
 * 페이지뷰 추적
 * App Router에서 라우트 변경 시 수동 호출
 */
export const pageview = (url: string, title?: string): void => {
  if (!gaConfig.measurementId) return

  gtag("config", gaConfig.measurementId, {
    page_path: url,
    page_title: title,
    debug_mode: gaConfig.debugMode,
  })
}

/**
 * 커스텀 이벤트 추적
 */
export const event = (name: string, params?: Record<string, unknown>): void => {
  if (!gaConfig.measurementId) return

  gtag("event", name, {
    ...params,
    debug_mode: gaConfig.debugMode,
  })
}
