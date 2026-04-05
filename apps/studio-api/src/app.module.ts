import { Module } from "@nestjs/common"
import type { MiddlewareConsumer, NestModule } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { DrizzleModule } from "./database/drizzle.module.js"
import { GentityModule } from "./gentity/gentity.module.js"
import { BuildityModule } from "./buildity/buildity.module.js"
import { AssistantModule } from "./assistant/assistant.module.js"
import { RequestLoggerMiddleware } from "./request-logger.middleware.js"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule,
    GentityModule,
    BuildityModule,
    AssistantModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes("*")
  }
}
