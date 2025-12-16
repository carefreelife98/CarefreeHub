/**
 * Analytics 이벤트 추적 함수
 * @features/analytics/lib/track-events
 */

import { event } from "@shared/lib/analytics"
import {
  CustomEvents,
  EventCategory,
  type PostClickParams,
  type SearchParams,
  type CategorySelectParams,
  type ExternalLinkClickParams,
  type ScrollDepthParams,
  type TocClickParams,
} from "../model/types"

/**
 * 포스트 클릭 이벤트
 */
export const trackPostClick = ({ slug, title }: PostClickParams): void => {
  event(CustomEvents.POST_CLICK, {
    category: EventCategory.CONTENT,
    post_slug: slug,
    post_title: title,
  })
}

/**
 * 검색 쿼리 이벤트
 */
export const trackSearch = ({ query, resultsCount }: SearchParams): void => {
  event(CustomEvents.SEARCH_QUERY, {
    category: EventCategory.SEARCH,
    search_term: query,
    results_count: resultsCount,
  })
}

/**
 * 카테고리 선택 이벤트
 */
export const trackCategorySelect = ({ category }: CategorySelectParams): void => {
  event(CustomEvents.CATEGORY_SELECT, {
    category: EventCategory.NAVIGATION,
    category_name: category,
  })
}

/**
 * 외부 링크 클릭 이벤트
 */
export const trackExternalLinkClick = ({ url, text }: ExternalLinkClickParams): void => {
  event(CustomEvents.EXTERNAL_LINK_CLICK, {
    category: EventCategory.ENGAGEMENT,
    link_url: url,
    link_text: text,
  })
}

/**
 * 스크롤 깊이 이벤트
 */
export const trackScrollDepth = ({ depth, postSlug }: ScrollDepthParams): void => {
  event(CustomEvents.SCROLL_DEPTH, {
    category: EventCategory.ENGAGEMENT,
    scroll_depth: depth,
    post_slug: postSlug,
  })
}

/**
 * TOC 클릭 이벤트
 */
export const trackTocClick = ({ headingId, headingTitle }: TocClickParams): void => {
  event(CustomEvents.TOC_CLICK, {
    category: EventCategory.NAVIGATION,
    heading_id: headingId,
    heading_title: headingTitle,
  })
}
