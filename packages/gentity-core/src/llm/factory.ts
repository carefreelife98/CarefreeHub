// packages/gentity-core/src/llm/factory.ts

import { ChatAnthropic } from "@langchain/anthropic"
import { ChatOpenAI } from "@langchain/openai"
import type { BaseChatModel } from "@langchain/core/language_models/chat_models"
import type { LlmConfig } from "@carefree-studio/shared"

export type LlmModel = BaseChatModel

export function createLlmModel(config: LlmConfig): LlmModel {
  switch (config.provider) {
    case "anthropic":
      return new ChatAnthropic({
        model: config.model,
        ...(config.maxTokens != null ? { maxTokens: config.maxTokens } : {}),
      })
    case "openai":
      return new ChatOpenAI({
        model: config.model,
        ...(config.maxTokens != null ? { maxTokens: config.maxTokens } : {}),
      })
    default: {
      const _exhaustive: never = config.provider
      throw new Error(`Unsupported LLM provider: ${_exhaustive}`)
    }
  }
}
