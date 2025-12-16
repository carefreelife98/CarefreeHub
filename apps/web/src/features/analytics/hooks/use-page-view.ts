"use client"

/**
 * 페이지뷰 자동 추적 훅
 * @features/analytics/hooks/use-page-view
 */

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { pageview } from "@shared/lib/analytics"
import { isAnalyticsEnabled } from "@shared/config/analytics"

/**
 * App Router 라우트 변경 감지 및 페이지뷰 추적
 */
export function usePageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!isAnalyticsEnabled()) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")
    pageview(url, document.title)
  }, [pathname, searchParams])
}
