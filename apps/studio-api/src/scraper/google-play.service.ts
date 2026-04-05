import { Injectable } from "@nestjs/common"
import { searchGooglePlay, fetchGooglePlayReviews } from "@carefree-studio/scraper-adapters"
import type { SearchLocale } from "@carefree-studio/scraper-adapters"
import type { Competitor, AppReview } from "@carefree-studio/shared"

@Injectable()
export class GooglePlayService {
  searchApps(keyword: string, limit: number, locale?: SearchLocale): Promise<Competitor[]> {
    return searchGooglePlay(keyword, limit, locale)
  }

  fetchReviews(appId: string, limit: number): Promise<AppReview[]> {
    return fetchGooglePlayReviews(appId, limit)
  }
}
