import { Module } from "@nestjs/common"
import { GentityController } from "./gentity.controller.js"
import { GentityService } from "./gentity.service.js"
import { ScraperModule } from "../scraper/scraper.module.js"

@Module({
  imports: [ScraperModule],
  controllers: [GentityController],
  providers: [GentityService],
  exports: [GentityService],
})
export class GentityModule {}
