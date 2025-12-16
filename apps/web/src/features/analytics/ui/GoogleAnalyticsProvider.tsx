"use client"

/**
 * Google Analytics 초기화 Provider
 * @features/analytics/ui/GoogleAnalyticsProvider
 */

import Script from "next/script"
import { gaConfig, isAnalyticsEnabled } from "@shared/config/analytics"
import { usePageView } from "../hooks"

/**
 * GA4 스크립트 로드 및 페이지뷰 자동 추적
 * Root Layout에서 Suspense로 감싸서 사용
 */
export function GoogleAnalyticsProvider() {
  usePageView()

  if (!isAnalyticsEnabled()) {
    return null
  }

  const { measurementId, debugMode } = gaConfig

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            send_page_view: false,
            debug_mode: ${debugMode}
          });
        `}
      </Script>
    </>
  )
}
