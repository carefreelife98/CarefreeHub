import { Controller, Get, Post, Body, Param, Res, NotFoundException } from "@nestjs/common"
import type { Response } from "express"
import { GentityService } from "./gentity.service.js"
import { randomUUID } from "crypto"
import { Subject } from "rxjs"
import type { AnalyzeRequest, ApiResponse, GentityReport, NodeEvent } from "@carefree-studio/shared"

const activeStreams = new Map<string, Subject<NodeEvent>>()

@Controller("api/gentity")
export class GentityController {
  constructor(private readonly gentityService: GentityService) {}

  @Post("analyze")
  startAnalysis(@Body() request: AnalyzeRequest): ApiResponse<{ analysisId: string }> {
    const analysisId = randomUUID()
    const subject = new Subject<NodeEvent>()
    activeStreams.set(analysisId, subject)

    const emitter = (event: NodeEvent) => {
      subject.next(event)
    }

    this.gentityService
      .runAnalysis(analysisId, request, emitter)
      .then(() => {
        subject.complete()
        activeStreams.delete(analysisId)
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === "string"
              ? error
              : JSON.stringify(error) || "Unknown error"
        subject.error(message)
        activeStreams.delete(analysisId)
      })

    return { success: true, data: { analysisId } }
  }

  @Get("analyze/:id/events")
  streamEvents(@Param("id") id: string, @Res() res: Response): void {
    const subject = activeStreams.get(id)
    if (!subject) {
      res
        .status(404)
        .json({
          success: false,
          error: { code: "NOT_FOUND", message: "Analysis stream not found" },
        })
      return
    }

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.setHeader("X-Accel-Buffering", "no")
    res.flushHeaders()

    // Railway 60초 idle timeout 방지: 15초마다 ping 전송
    const heartbeat = setInterval(() => {
      res.write("event: ping\ndata: keep-alive\n\n")
    }, 15000)

    const subscription = subject.subscribe({
      next: (event) => {
        res.write(`data: ${JSON.stringify(event)}\n\n`)
      },
      complete: () => {
        res.write("event: done\ndata: {}\n\n")
        res.end()
      },
      error: (err: unknown) => {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === "string" && err
              ? err
              : "Unknown error"
        res.write(`event: server-error\ndata: ${JSON.stringify({ error: message })}\n\n`)
        res.write("event: done\ndata: {}\n\n")
        res.end()
      },
    })

    res.on("close", () => {
      clearInterval(heartbeat)
      subscription.unsubscribe()
    })
  }

  @Get("result/:id")
  async getResult(@Param("id") id: string): Promise<ApiResponse<GentityReport>> {
    const result = await this.gentityService.getResult(id)
    if (!result) throw new NotFoundException("Analysis not found")
    return { success: true, data: result }
  }
}
