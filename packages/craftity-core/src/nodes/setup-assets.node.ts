// packages/craftity-core/src/nodes/setup-assets.node.ts

import { z } from "zod"
import { BaseNode } from "./base.node.js"
import { createLlmModel, type LlmModel } from "../llm/factory.js"
import { SETUP_ASSETS_PROMPT } from "../prompts/system-prompts.js"
import type { NodeCompleteSummary, NodeEventEmitter, LlmConfig } from "@carefree-studio/shared"
import type { ParsedPrd, AssetManifest } from "@carefree-studio/shared"

const AssetPlaceholderSchema = z.object({
  name: z.string().describe("에셋 식별자 (camelCase, 예: playerSprite)"),
  shape: z.enum(["rectangle", "circle", "triangle"]).describe("도형 타입"),
  color: z.string().describe("16진수 색상 코드 (예: #4488ff)"),
  width: z.number().describe("도형 너비(픽셀), circle의 경우 지름"),
  height: z.number().describe("도형 높이(픽셀), circle의 경우 지름과 동일"),
  role: z.string().describe("이 에셋이 게임에서 나타내는 역할 (예: player, enemy, platform)"),
})

const AssetManifestSchema = z.object({
  palette: z.array(z.string()).describe("게임에서 사용할 16진수 색상 코드 목록 (예: ['#1a1a2e', '#4488ff'])"),
  placeholders: z.array(AssetPlaceholderSchema).describe("기하학적 도형으로 표현되는 에셋 플레이스홀더 목록"),
})

export class SetupAssetsNode extends BaseNode<ParsedPrd, AssetManifest> {
  readonly nodeId = "setup-assets"

  private readonly model: LlmModel

  constructor(emitter: NodeEventEmitter, graphId: string, llmConfig: LlmConfig) {
    super(emitter, graphId)
    this.model = createLlmModel(llmConfig)
  }

  protected async process(prd: ParsedPrd): Promise<AssetManifest> {
    this.emitProgress("에셋 팔레트를 구성하고 있어요", 40)

    const structured = this.model.withStructuredOutput(AssetManifestSchema)
    const result = await structured.invoke([
      {
        role: "system",
        content: SETUP_ASSETS_PROMPT,
      },
      {
        role: "user",
        content: [
          `Art Style: ${prd.artStyle}`,
          `Core Loop: ${prd.coreLoop}`,
          `Title: ${prd.title}`,
        ].join("\n\n"),
      },
    ])

    this.emitProgress("에셋 매니페스트를 완료했어요", 90)

    return result as AssetManifest
  }

  protected buildSummary(result: AssetManifest): NodeCompleteSummary {
    return {
      kind: "setup-assets",
      paletteCount: result.palette.length,
      placeholderCount: result.placeholders.length,
    }
  }
}
