import { Injectable, Inject } from "@nestjs/common"
import { analyze, logger } from "@carefree-studio/gentity-core"
import { eq } from "drizzle-orm"
import { GooglePlayService } from "../scraper/google-play.service.js"
import { AppStoreService } from "../scraper/app-store.service.js"
import { DRIZZLE } from "../database/drizzle.module.js"
import { analyses } from "../database/schema.js"
import type { AnalyzeRequest, GentityReport, NodeEventEmitter } from "@carefree-studio/shared"
import type { SearchLocale } from "@carefree-studio/scraper-adapters"
import type { drizzle } from "drizzle-orm/postgres-js"
import type * as schema from "../database/schema.js"

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>

@Injectable()
export class GentityService {
  constructor(
    private readonly googlePlay: GooglePlayService,
    private readonly appStore: AppStoreService,
    @Inject(DRIZZLE) private readonly db: DrizzleDb
  ) {}

  async runAnalysis(
    analysisId: string,
    request: AnalyzeRequest,
    emitter: NodeEventEmitter
  ): Promise<GentityReport> {
    const report = await analyze(
      request,
      {
        searchGooglePlay: (kw: string, limit: number, locale?: SearchLocale) =>
          this.googlePlay.searchApps(kw, limit, locale),
        searchAppStore: (kw: string, limit: number, locale?: SearchLocale) =>
          this.appStore.searchApps(kw, limit, locale),
        fetchGooglePlayReviews: (id: string, limit: number) =>
          this.googlePlay.fetchReviews(id, limit),
        fetchAppStoreReviews: (id: string, limit: number) => this.appStore.fetchReviews(id, limit),
      },
      emitter,
      analysisId
    )

    try {
      await this.db.insert(analyses).values({
        id: analysisId,
        query: request.query,
        parsedParams: report.parsedParams,
        competitors: report.competitors,
        insights: report.insights,
        concept: report.concept,
        finalReport: report,
      })
    } catch (dbError) {
      logger.error("[gentity] DB insert failed, returning report without persistence", {
        analysisId,
        error: dbError instanceof Error ? dbError.message : String(dbError),
      })
    }

    return report
  }

  async getResult(analysisId: string): Promise<GentityReport | null> {
    const rows = await this.db.select().from(analyses).where(eq(analyses.id, analysisId)).limit(1)

    if (rows.length === 0) return null
    return rows[0].finalReport as GentityReport
  }
}
