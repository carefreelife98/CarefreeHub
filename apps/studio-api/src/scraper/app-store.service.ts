import { Injectable } from "@nestjs/common"
import { searchAppStore, fetchAppStoreReviews } from "@carefree-studio/scraper-adapters"
import type { SearchLocale } from "@carefree-studio/scraper-adapters"
import type { Competitor, AppReview } from "@carefree-studio/shared"

@Injectable()
export class AppStoreService {
  searchApps(keyword: string, limit: number, locale?: SearchLocale): Promise<Competitor[]> {
    return searchAppStore(keyword, limit, locale)
  }

  fetchReviews(appId: string, limit: number): Promise<AppReview[]> {
    return fetchAppStoreReviews(appId, limit)
  }
}
