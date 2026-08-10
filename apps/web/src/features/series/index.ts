/**
 * Series Feature Public API
 * @features/series
 */

export {
  getAllSeries,
  getSeriesBySlug,
  getSeriesPosts,
  getSeriesNavData,
  type SeriesNavData,
} from "./lib/series"
export { SeriesNav } from "./ui/SeriesNav"
export { SeriesCard } from "./ui/SeriesCard"
