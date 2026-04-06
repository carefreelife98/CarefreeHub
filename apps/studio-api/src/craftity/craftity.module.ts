import { Module } from "@nestjs/common"
import { CraftityController } from "./craftity.controller.js"
import { CraftityService } from "./craftity.service.js"
import { AstValidatorService } from "./ast-validator.service.js"

@Module({
  controllers: [CraftityController],
  providers: [CraftityService, AstValidatorService],
  exports: [CraftityService],
})
export class CraftityModule {}
