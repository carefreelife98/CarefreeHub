"use client"

/**
 * 포스트 상세 페이지용 인게이지먼트 추적 컴포넌트
 * @features/analytics/ui/PostAnalytics
 *
 * 서버 컴포넌트인 포스트 페이지에서 클라이언트 훅(스크롤 깊이, 외부 링크)을
 * 사용하기 위한 렌더링 없는 래퍼
 */

import { useScrollTracking, useExternalLinkTracking } from "../hooks"

export function PostAnalytics({ postSlug }: { postSlug: string }) {
  useScrollTracking(postSlug)
  useExternalLinkTracking()
  return null
}
