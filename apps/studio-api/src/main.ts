import { NestFactory } from "@nestjs/core"
import { logger } from "@carefree-studio/gentity-core"
import { AppModule } from "./app.module.js"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:4000", "http://127.0.0.1:4000"]

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  })

  const port = parseInt(process.env.PORT ?? "3001", 10)
  await app.listen(port)

  const server = app.getHttpServer()
  server.keepAliveTimeout = 310_000
  server.headersTimeout = 320_000
  server.requestTimeout = 0

  logger.info(`Carefree Studio API running on http://localhost:${port}`)
}

bootstrap()
