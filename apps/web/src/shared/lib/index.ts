/**
 * Shared Lib Public API
 * @shared/lib
 */

export { cn } from "./utils"
export {
  getFeaturedPosts,
  getLatestPosts,
  getHotPosts,
  getAllPublishedPosts,
  getPaginatedPosts,
  getTotalPages,
  POSTS_PER_PAGE,
} from "./posts"
