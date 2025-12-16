/**
 * Shared Config Public API
 * @shared/config
 */

export { siteConfig, type SiteConfig } from "./site"
export { gaConfig, isAnalyticsEnabled } from "./analytics"
export {
  categoryTree,
  getAllCategorySlugs,
  findCategoryBySlug,
  getCategoryPath,
  getCategoryWithDescendants,
  getCategoryIcon,
  getCategoryColor,
  type CategoryNode,
} from "./categories"
