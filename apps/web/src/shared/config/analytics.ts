/**
 * Google Analytics 설정
 * @shared/config/analytics
 */

export const gaConfig = {
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  debugMode: process.env.NEXT_PUBLIC_GA_DEBUG_MODE === "true",
} as const

/**
 * Analytics 활성화 여부 확인
 * 환경변수가 올바르게 설정되었는지 검증
 */
export const isAnalyticsEnabled = (): boolean => {
  return !!gaConfig.measurementId && gaConfig.measurementId.startsWith("G-")
}
