// packages/gentity-core/src/__tests__/factory.test.ts

import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { createLlmModel } from "../llm/factory.js"

const originalAnthropicKey = process.env.ANTHROPIC_API_KEY
const originalOpenAIKey = process.env.OPENAI_API_KEY

beforeAll(() => {
  process.env.ANTHROPIC_API_KEY = "sk-ant-test-dummy"
  process.env.OPENAI_API_KEY = "sk-test-dummy"
})

afterAll(() => {
  process.env.ANTHROPIC_API_KEY = originalAnthropicKey
  process.env.OPENAI_API_KEY = originalOpenAIKey
})

describe("createLlmModel", () => {
  it("anthropic provider로 ChatAnthropic 모델을 생성한다", () => {
    const model = createLlmModel({ provider: "anthropic", model: "claude-sonnet-4-6" })
    expect(model).toBeDefined()
    expect(model.constructor.name).toBe("ChatAnthropic")
  })

  it("openai provider로 ChatOpenAI 모델을 생성한다", () => {
    const model = createLlmModel({ provider: "openai", model: "gpt-4o" })
    expect(model).toBeDefined()
    expect(model.constructor.name).toBe("ChatOpenAI")
  })

  it("maxTokens를 명시하면 해당 값을 사용한다", () => {
    const model = createLlmModel({
      provider: "anthropic",
      model: "claude-sonnet-4-6",
      maxTokens: 4096,
    })
    // @ts-expect-error internal field access for test
    expect(model.maxTokens).toBe(4096)
  })

  it("maxTokens를 생략하면 anthropic은 모델별 기본값을 사용한다", () => {
    const model = createLlmModel({ provider: "anthropic", model: "claude-sonnet-4-6" })
    // @ts-expect-error internal field access for test
    expect(model.maxTokens).toBe(16384)
  })

  it("지원하지 않는 provider는 에러를 던진다", () => {
    expect(() =>
      // @ts-expect-error intentional invalid provider
      createLlmModel({ provider: "invalid", model: "some-model" })
    ).toThrow("Unsupported LLM provider")
  })
})
