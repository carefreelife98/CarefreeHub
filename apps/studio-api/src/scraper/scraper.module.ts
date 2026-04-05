import { Module } from "@nestjs/common"
import { GooglePlayService } from "./google-play.service.js"
import { AppStoreService } from "./app-store.service.js"

@Module({
  providers: [GooglePlayService, AppStoreService],
  exports: [GooglePlayService, AppStoreService],
})
export class ScraperModule {}
