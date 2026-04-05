// apps/api/src/assistant/assistant.controller.ts

import { Controller, Post, Body, Res } from "@nestjs/common"
import type { Response } from "express"
import { AssistantService } from "./assistant.service.js"

interface ChatRequest {
  message: string
  history?: { role: "user" | "assistant"; content: string }[]
}

@Controller("api")
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post("assistant")
  async chat(@Body() body: ChatRequest, @Res() res: Response): Promise<void> {
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.setHeader("X-Accel-Buffering", "no")
    res.flushHeaders()

    const heartbeat = setInterval(() => {
      res.write("event: ping\ndata: keep-alive\n\n")
    }, 15000)

    try {
      for await (const text of this.assistantService.chatStream(body.message, body.history ?? [])) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`)
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

  @Post("gentity/suggest-keywords")
  async suggestKeywords(): Promise<{
    suggestions: { keyword: string; genre: string; description: string }[]
  }> {
    const suggestions = await this.assistantService.suggestKeywords()
    return { suggestions }
  }
}
