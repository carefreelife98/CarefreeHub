// apps/api/src/buildity/buildity.controller.ts

import { Controller, Post, Body, Res } from "@nestjs/common"
import type { Response } from "express"
import { BuildityService } from "./buildity.service.js"
import type {
  ChipGenerateRequest,
  ChipRefreshRequest,
  ChipGenerateResponse,
  ChipCategory,
  PrdBuildRequest,
  PrdBuildResponse,
  ApiResponse,
} from "@carefree-studio/shared"

@Controller("api/buildity")
export class BuildityController {
  constructor(private readonly buildityService: BuildityService) {}

  @Post("chips")
  async generateChips(
    @Body() request: ChipGenerateRequest
  ): Promise<ApiResponse<ChipGenerateResponse>> {
    const result = await this.buildityService.generateChips(request)
    return { success: true, data: result }
  }

  @Post("chips/stream")
  async chipsStream(@Body() request: ChipGenerateRequest, @Res() res: Response): Promise<void> {
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.setHeader("X-Accel-Buffering", "no")
    res.flushHeaders()

    const heartbeat = setInterval(() => {
      res.write("event: ping\ndata: keep-alive\n\n")
    }, 15000)

    try {
      for await (const item of this.buildityService.generateChipsStream(request)) {
        if (item.type === "plan") {
          res.write(
            `event: plan\ndata: ${JSON.stringify({ total: item.total, labels: item.labels })}\n\n`
          )
        } else if (item.type === "category") {
          res.write(
            `event: category\ndata: ${JSON.stringify({ index: item.index, ...item.category })}\n\n`
          )
        } else if (item.type === "hint-chunk") {
          res.write(`event: hint-chunk\ndata: ${JSON.stringify({ text: item.text })}\n\n`)
        } else if (item.type === "retry") {
          res.write(
            `event: retry\ndata: ${JSON.stringify({ attempt: item.attempt, maxRetries: item.maxRetries, error: item.error, label: item.label })}\n\n`
          )
        }
      }
      res.write("event: done\ndata: {}\n\n")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      res.write(`event: error\ndata: ${JSON.stringify({ error: message })}\n\n`)
    } finally {
      clearInterval(heartbeat)
      res.end()
    }
  }

  @Post("chips/refresh")
  async refreshChips(@Body() request: ChipRefreshRequest): Promise<ApiResponse<ChipCategory>> {
    const result = await this.buildityService.refreshChips(request)
    return { success: true, data: result }
  }

  @Post("build")
  async buildPrd(@Body() request: PrdBuildRequest): Promise<ApiResponse<PrdBuildResponse>> {
    const result = await this.buildityService.buildPrd(request)
    return { success: true, data: result }
  }

  @Post("build/stream")
  async buildPrdStream(@Body() request: PrdBuildRequest, @Res() res: Response): Promise<void> {
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.setHeader("X-Accel-Buffering", "no")
    res.flushHeaders()

    // Railway 60초 idle timeout 방지: 15초마다 ping 전송
    const heartbeat = setInterval(() => {
      res.write("event: ping\ndata: keep-alive\n\n")
    }, 15000)

    try {
      for await (const chunk of this.buildityService.buildPrdStream(request)) {
        if (chunk.type === "sections") {
          res.write(
            `event: sections\ndata: ${JSON.stringify({ total: chunk.total, titles: chunk.titles })}\n\n`
          )
        } else if (chunk.type === "section") {
          res.write(
            `event: section\ndata: ${JSON.stringify({ index: chunk.index, text: chunk.text })}\n\n`
          )
        } else if (chunk.type === "section-done") {
          res.write(`event: section-done\ndata: ${JSON.stringify({ index: chunk.index })}\n\n`)
        }
      }
      res.write("event: done\ndata: {}\n\n")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      res.write(`event: error\ndata: ${JSON.stringify({ error: message })}\n\n`)
    } finally {
      clearInterval(heartbeat)
      res.end()
    }
  }
}
