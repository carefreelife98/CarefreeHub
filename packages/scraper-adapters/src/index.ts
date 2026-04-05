// packages/scraper-adapters/src/index.ts

export {
  searchGooglePlay,
  fetchGooglePlayReviews,
  getTopGooglePlayGames,
} from "./google-play.adapter.js"
export type { SearchLocale } from "./types.js"

export { searchAppStore, fetchAppStoreReviews, getTopAppStoreGames } from "./app-store.adapter.js"
