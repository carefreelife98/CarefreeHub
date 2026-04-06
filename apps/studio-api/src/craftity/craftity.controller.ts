import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  NotFoundException,
} from "@nestjs/common"
import type { Response } from "express"
import { CraftityService } from "./craftity.service.js"
import { randomUUID } from "crypto"
import { Subject } from "rxjs"
import type { CraftityRequest, NodeEvent, ApiResponse } from "@carefree-studio/shared"

const activeStreams = new Map<string, Subject<NodeEvent>>()

// Auto-cleanup after 5 minutes
const STREAM_TIMEOUT_MS = 5 * 60 * 1000

@Controller("api/craftity")
export class CraftityController {
  constructor(private readonly craftityService: CraftityService) {}

  @Post("craft")
  startCraft(@Body() request: CraftityRequest): ApiResponse<{ streamId: string }> {
    const streamId = randomUUID()
    const subject = new Subject<NodeEvent>()
    activeStreams.set(streamId, subject)

    const emitter = (event: NodeEvent) => {
      subject.next(event)
    }

    // Auto-cleanup timeout
    const timeout = setTimeout(() => {
      if (activeStreams.has(streamId)) {
        subject.complete()
        activeStreams.delete(streamId)
      }
    }, STREAM_TIMEOUT_MS)

    this.craftityService
      .runCraft(request, emitter)
      .then(() => {
        clearTimeout(timeout)
        subject.complete()
        activeStreams.delete(streamId)
      })
      .catch((error: unknown) => {
        clearTimeout(timeout)
        const message =
          error instanceof Error
            ? error.message
            : typeof error === "string"
              ? error
              : JSON.stringify(error) || "Unknown error"
        subject.error(message)
        activeStreams.delete(streamId)
      })

    return { success: true, data: { streamId } }
  }

  @Get("craft/:streamId/events")
  streamEvents(@Param("streamId") streamId: string, @Res() res: Response): void {
    const subject = activeStreams.get(streamId)
    if (!subject) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Craft stream not found" },
      })
      return
    }

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.setHeader("X-Accel-Buffering", "no")
    res.flushHeaders()

    // 15-second heartbeat to prevent idle timeout
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

  @Get("game/:gameId")
  async getGame(@Param("gameId") gameId: string): Promise<ApiResponse<Record<string, unknown>>> {
    const game = await this.craftityService.getGame(gameId)
    if (!game) throw new NotFoundException("Game not found")
    return { success: true, data: game as unknown as Record<string, unknown> }
  }

  @Get("game/:gameId/files")
  async getLatestFiles(
    @Param("gameId") gameId: string
  ): Promise<ApiResponse<{ files: { path: string; content: string; hash: string }[] }>> {
    const version = await this.craftityService.getLatestVersion(gameId)
    if (!version) throw new NotFoundException("No versions found for this game")
    return { success: true, data: { files: version.files } }
  }
}
