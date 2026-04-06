// packages/craftity-core/src/nodes/design-structure.node.ts

import { z } from "zod"
import { BaseNode } from "./base.node.js"
import { createLlmModel, type LlmModel } from "../llm/factory.js"
import { DESIGN_STRUCTURE_PROMPT } from "../prompts/system-prompts.js"
import type { NodeCompleteSummary, NodeEventEmitter, LlmConfig } from "@carefree-studio/shared"
import type { ParsedPrd, ProjectDesign } from "@carefree-studio/shared"

const SceneDesignSchema = z.object({
  name: z.string().describe("PascalCase 씬 클래스 이름 (예: GameScene)"),
  fileName: z.string().describe("씬 파일 경로 (예: src/scenes/GameScene.ts)"),
  description: z.string().describe("씬의 역할 및 책임 설명"),
  publicMethods: z.array(z.string()).describe("씬이 외부에 노출하는 public 메서드 목록"),
})

const ObjectDesignSchema = z.object({
  name: z.string().describe("PascalCase 게임 오브젝트 클래스 이름"),
  fileName: z.string().describe("오브젝트 파일 경로 (예: src/objects/Player.ts)"),
  description: z.string().describe("게임 오브젝트의 역할 및 동작 설명"),
  publicInterface: z.string().describe("오브젝트가 제공하는 public 인터페이스 요약"),
})

const ProjectDesignSchema = z.object({
  scenes: z.array(SceneDesignSchema).describe("프로젝트에 포함될 씬 목록"),
  objects: z.array(ObjectDesignSchema).describe("프로젝트에 포함될 게임 오브젝트 목록"),
  typeDefinitions: z.string().describe("src/types/index.ts에 정의될 TypeScript 인터페이스 및 타입"),
  configConstants: z.string().describe("게임 설정에 사용될 상수 정의 (예: GAME_WIDTH, GAME_HEIGHT)"),
})

export class DesignStructureNode extends BaseNode<ParsedPrd, ProjectDesign> {
  readonly nodeId = "design-structure"

  private readonly model: LlmModel

  constructor(emitter: NodeEventEmitter, graphId: string, llmConfig: LlmConfig) {
    super(emitter, graphId)
    this.model = createLlmModel(llmConfig)
  }

  protected async process(prd: ParsedPrd): Promise<ProjectDesign> {
    this.emitProgress("프로젝트 구조를 설계하고 있어요", 40)

    const structured = this.model.withStructuredOutput(ProjectDesignSchema)
    const result = await structured.invoke([
      {
        role: "system",
        content: DESIGN_STRUCTURE_PROMPT,
      },
      {
        role: "user",
        content: [
          `Title: ${prd.title}`,
          `Core Loop: ${prd.coreLoop}`,
          `Art Style: ${prd.artStyle}`,
          `Tech Spec: ${prd.techSpec}`,
          `Target User: ${prd.targetUser}`,
          `Monetization: ${prd.monetization}`,
        ].join("\n\n"),
      },
    ])

    this.emitProgress("프로젝트 구조 설계를 완료했어요", 90)

    return result as ProjectDesign
  }

  protected buildSummary(result: ProjectDesign): NodeCompleteSummary {
    return {
      kind: "design-structure",
      sceneCount: result.scenes.length,
      objectCount: result.objects.length,
    }
  }
}
