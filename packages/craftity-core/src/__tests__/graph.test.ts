// packages/craftity-core/src/__tests__/graph.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest"

// ── Mock @langchain/openai BEFORE importing anything that uses it ─────────────
vi.mock("@langchain/openai", () => {
  // Structured-output mock data keyed by which node call it is.
  // withStructuredOutput().invoke() is called by parse-prd, design-structure, setup-assets.
  // model.invoke() is called by generate-files and ast-validate (for fixes).

  const mockParsedPrd = {
    title: "Test Game",
    overview: "A simple test game",
    coreLoop: "Tap to score points",
    monetization: "Free-to-play",
    targetUser: "Casual gamers",
    artStyle: "Pixel art",
    techSpec: "Phaser 3, TypeScript",
    kpiMetrics: "DAU, retention",
  }

  const mockProjectDesign = {
    scenes: [
      {
        name: "GameScene",
        fileName: "src/scenes/GameScene.ts",
        description: "Main gameplay scene",
        publicMethods: ["start", "stop"],
      },
    ],
    objects: [],
    typeDefinitions: "export interface GameState { score: number }",
    configConstants: "export const GAME_WIDTH = 800;",
  }

  const mockAssetManifest = {
    palette: ["#1a1a2e", "#4488ff"],
    placeholders: [
      {
        name: "playerSprite",
        shape: "rectangle" as const,
        color: "#4488ff",
        width: 32,
        height: 32,
        role: "player",
      },
    ],
  }

  // Plain text returned by model.invoke() (generate-files phase)
  const mockGeneratedCode = "export const placeholder = true;"

  // Each withStructuredOutput call returns an object with invoke that cycles
  // through the mock responses for parse-prd → design-structure → setup-assets.
  let structuredCallIndex = 0
  const structuredResponses = [mockParsedPrd, mockProjectDesign, mockAssetManifest]

  const mockWithStructuredOutput = vi.fn(() => ({
    invoke: vi.fn(() => {
      const response = structuredResponses[structuredCallIndex % structuredResponses.length]
      structuredCallIndex++
      return Promise.resolve(response)
    }),
  }))

  const mockInvoke = vi.fn(() =>
    Promise.resolve({
      content: mockGeneratedCode,
    })
  )

  const MockChatOpenAI = vi.fn().mockImplementation(() => ({
    invoke: mockInvoke,
    withStructuredOutput: mockWithStructuredOutput,
  }))

  return { ChatOpenAI: MockChatOpenAI }
})

// ── Also mock @langchain/anthropic to avoid import errors ────────────────────
vi.mock("@langchain/anthropic", () => {
  const MockChatAnthropic = vi.fn().mockImplementation(() => ({
    invoke: vi.fn(),
    withStructuredOutput: vi.fn(),
  }))
  return { ChatAnthropic: MockChatAnthropic }
})

// ── Import after mocks are set up ────────────────────────────────────────────
import { craft } from "../index.js"
import type { GeneratedFile, ValidationError } from "@carefree-studio/shared"

describe("craft() — integration smoke test", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns a CraftityResult with files, passing validation, and template files", async () => {
    const mockValidateFn = vi.fn(
      (_files: GeneratedFile[]): Promise<ValidationError[]> => Promise.resolve([])
    )

    const result = await craft(
      {
        prdMarkdown: "# Test Game\n\nA simple tap game for testing.",
        llm: { provider: "openai", model: "gpt-4o-mini" },
      },
      { validateFn: mockValidateFn }
    )

    // Result structure exists
    expect(result).toBeDefined()
    expect(result.gameId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
    expect(result.versionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )

    // Files are present
    expect(Array.isArray(result.files)).toBe(true)
    expect(result.files.length).toBeGreaterThan(0)

    // Template files are included
    const filePaths = result.files.map((f) => f.path)
    expect(filePaths).toContain("package.json")
    expect(filePaths).toContain("tsconfig.json")
    expect(filePaths).toContain("vite.config.ts")
    expect(filePaths).toContain("index.html")

    // Validation passed (mock validateFn returns no errors)
    expect(result.validation.passed).toBe(true)
    expect(result.validation.errors).toHaveLength(0)

    // Meta fields
    expect(result.meta).toBeDefined()
    expect(result.meta.llmProvider).toBe("openai")
    expect(typeof result.meta.llmCallCount).toBe("number")
    expect(result.meta.llmCallCount).toBeGreaterThan(0)

    // validateFn was called at least once
    expect(mockValidateFn).toHaveBeenCalledTimes(1)
  })
})
