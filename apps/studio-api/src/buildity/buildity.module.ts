// apps/api/src/buildity/buildity.module.ts

import { Module } from "@nestjs/common"
import { BuildityController } from "./buildity.controller.js"
import { BuildityService } from "./buildity.service.js"
import { GentityModule } from "../gentity/gentity.module.js"

@Module({
  imports: [GentityModule],
  controllers: [BuildityController],
  providers: [BuildityService],
})
export class BuildityModule {}
