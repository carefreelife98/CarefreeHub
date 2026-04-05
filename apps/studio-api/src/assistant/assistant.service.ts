// apps/api/src/assistant/assistant.service.ts

import { Injectable } from "@nestjs/common"
import { createAgent } from "langchain"
import { HumanMessage, AIMessage } from "@langchain/core/messages"
import type { BaseMessage } from "@langchain/core/messages"
import { z } from "zod"
import { createLlmModel, logger } from "@carefree-studio/gentity-core"
import { DEFAULT_LLM_CONFIG } from "@carefree-studio/shared"
import { getTopGooglePlayGames, getTopAppStoreGames } from "@carefree-studio/scraper-adapters"
import { agentTools } from "./tools.js"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

const KeywordSuggestionSchema = z.object({
  suggestions: z
    .array(
      z.object({
        keyword: z.string().describe("게임 검색 키워드 (한국어)"),
        genre: z
          .enum(["casual", "simulation", "arcade", "puzzle", "action", "strategy", "rpg"])
          .describe("게임 장르"),
        description: z.string().describe("이 키워드가 트렌드인 이유 (한국어, 1줄)"),
      })
    )
    .describe("5개의 트렌드 게임 키워드 추천"),
})

type KeywordSuggestion = z.infer<typeof KeywordSuggestionSchema>["suggestions"][number]

@Injectable()
export class AssistantService {
  private readonly assistantAgent = createAgent({
    model:
      DEFAULT_LLM_CONFIG.provider === "openai"
        ? `openai:${DEFAULT_LLM_CONFIG.model}`
        : `anthropic:${DEFAULT_LLM_CONFIG.model}`,
    tools: agentTools,
    systemPrompt: `You are a mobile game industry expert assistant.
You help users understand game industry terminology, concepts, market trends, and game design principles.
When users ask about specific games or genres, use the store search tools to find real data.
Always respond in Korean. Be concise and helpful. Use markdown formatting for better readability.`,
  })

  async *chatStream(message: string, history: ChatMessage[]): AsyncGenerator<string> {
    const startMs = Date.now()
    logger.info("[assistant] ▶ chatStream", {
      messageLength: message.length,
      historyLength: history.length,
    })

    const messages: BaseMessage[] = history.map((m) =>
      m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
    )
    messages.push(new HumanMessage(message))

    const stream = await this.assistantAgent.stream(
      { messages },
      { recursionLimit: 10, streamMode: "messages" }
    )

    for await (const chunk of stream) {
      const [msg] = chunk
      if (msg && typeof msg.content === "string" && msg.content) {
        yield msg.content
      }
    }

    logger.info("[assistant] ✔ chatStream", { durationMs: Date.now() - startMs })
  }

  async suggestKeywords(): Promise<KeywordSuggestion[]> {
    const startMs = Date.now()
    logger.info("[assistant] ▶ suggestKeywords")

    try {
      // Step 1: 실시간 스토어 인기 차트 수집 (병렬)
      const [gpResult, asResult] = await Promise.allSettled([
        getTopGooglePlayGames(15, "kr"),
        getTopAppStoreGames(15, "kr"),
      ])

      const gpGames = gpResult.status === "fulfilled" ? gpResult.value : []
      const asGames = asResult.status === "fulfilled" ? asResult.value : []
      const allGames = [...gpGames, ...asGames]

      const storeData = allGames
        .map((g) => `${g.title} (${g.genre || "N/A"}, ★${(g.score ?? 0).toFixed(1)})`)
        .join("\n")

      // Step 2: 실시간 데이터 기반으로 structured output 추천 생성
      const model = createLlmModel(DEFAULT_LLM_CONFIG)
      const structured = model.withStructuredOutput(KeywordSuggestionSchema)

      const result = await structured.invoke([
        {
          role: "system",
          content: `You are a mobile game market trend analyst.
Based on the REAL store data below, suggest 5 trending mobile game keywords for competitive analysis.
Each keyword should represent a popular or emerging genre/theme that has real games in the stores.

Current store data:
${storeData}

Write in Korean. Base your suggestions on the actual games found above.`,
        },
        {
          role: "user",
          content: "위 스토어 데이터를 기반으로 현재 트렌드인 게임 키워드 5개를 추천해주세요.",
        },
      ])

      const parsed = result as z.infer<typeof KeywordSuggestionSchema>
      logger.info("[assistant] ✔ suggestKeywords", {
        durationMs: Date.now() - startMs,
        count: parsed.suggestions.length,
      })
      return parsed.suggestions
    } catch (e) {
      logger.warn("[assistant] suggestKeywords failed, using fallback", { error: String(e) })
      return [
        { keyword: "방치형 RPG", genre: "rpg", description: "오프라인 보상 기반 성장" },
        { keyword: "머지 퍼즐", genre: "puzzle", description: "아이템 합치기 퍼즐" },
        { keyword: "하이퍼캐주얼 러너", genre: "casual", description: "간단 조작 러닝 게임" },
        { keyword: "타이쿤 시뮬레이션", genre: "simulation", description: "경영 시뮬레이션" },
        { keyword: "로그라이크 액션", genre: "action", description: "랜덤 던전 탐험 액션" },
      ]
    }
  }
}
