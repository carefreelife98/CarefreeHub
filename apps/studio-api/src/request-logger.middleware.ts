// apps/api/src/request-logger.middleware.ts

import type { NestMiddleware } from "@nestjs/common"
import { Injectable } from "@nestjs/common"
import type { Request, Response, NextFunction } from "express"
import { logHttp, logHttpResponse } from "@carefree-studio/gentity-core"

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now()
    const { method, originalUrl, body } = req

    const isStream = originalUrl.includes("/stream") || originalUrl.includes("/events")
    logHttp(method, originalUrl, isStream ? "(stream)" : body)

    res.on("finish", () => {
      logHttpResponse(method, originalUrl, res.statusCode, Date.now() - start)
    })

    next()
  }
}
