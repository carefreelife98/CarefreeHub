/**
 * Analytics Feature Public API
 * @features/analytics
 *
 * FSD 규칙: 이 파일을 통해서만 외부에서 import 가능
 */

// UI Components
export { GoogleAnalyticsProvider } from "./ui/GoogleAnalyticsProvider"

// Hooks
export { usePageView, useScrollTracking, useExternalLinkTracking } from "./hooks"

// Event Tracking Functions
export {
  trackPostClick,
  trackSearch,
  trackCategorySelect,
  trackExternalLinkClick,
  trackScrollDepth,
  trackTocClick,
} from "./lib"

// Types
export type {
  PostClickParams,
  SearchParams,
  CategorySelectParams,
  ExternalLinkClickParams,
  ScrollDepthParams,
  TocClickParams,
  EventCategoryType,
  CustomEventType,
} from "./model/types"

export { EventCategory, CustomEvents } from "./model/types"
