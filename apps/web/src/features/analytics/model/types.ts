/**
 * Analytics 이벤트 타입 정의
 * @features/analytics/model/types
 */

// 이벤트 카테고리
export const EventCategory = {
  NAVIGATION: "navigation",
  CONTENT: "content",
  ENGAGEMENT: "engagement",
  SEARCH: "search",
} as const

export type EventCategoryType = (typeof EventCategory)[keyof typeof EventCategory]

// 커스텀 이벤트 이름
export const CustomEvents = {
  POST_CLICK: "post_click",
  SEARCH_QUERY: "search_query",
  CATEGORY_SELECT: "category_select",
  EXTERNAL_LINK_CLICK: "external_link_click",
  SCROLL_DEPTH: "scroll_depth",
  TOC_CLICK: "toc_click",
} as const

export type CustomEventType = (typeof CustomEvents)[keyof typeof CustomEvents]

// 이벤트 파라미터 타입
export interface PostClickParams {
  slug: string
  title: string
}

export interface SearchParams {
  query: string
  resultsCount?: number
}

export interface CategorySelectParams {
  category: string
}

export interface ExternalLinkClickParams {
  url: string
  text?: string
}

export interface ScrollDepthParams {
  depth: number
  postSlug?: string
}

export interface TocClickParams {
  headingId: string
  headingTitle: string
}
