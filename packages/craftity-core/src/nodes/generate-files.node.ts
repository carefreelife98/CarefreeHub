// packages/craftity-core/src/nodes/generate-files.node.ts

import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { BaseNode } from "./base.node.js"
import { createLlmModel, type LlmModel } from "../llm/factory.js"
import { buildGenerateFilePrompt } from "../prompts/system-prompts.js"
import type {
  NodeCompleteSummary,
  NodeEventEmitter,
  LlmConfig,
} from "@carefree-studio/shared"
import type {
  ParsedPrd,
  ProjectDesign,
  AssetManifest,
  GeneratedFile,
} from "@carefree-studio/shared"

export interface GenerateFilesInput {
  prd: ParsedPrd
  design: ProjectDesign
  assets: AssetManifest
}

export class GenerateFilesNode extends BaseNode<GenerateFilesInput, GeneratedFile[]> {
  readonly nodeId = "generate-files"

  private readonly model: LlmModel

  constructor(emitter: NodeEventEmitter, graphId: string, llmConfig: LlmConfig) {
    super(emitter, graphId)
    this.model = createLlmModel(llmConfig)
  }

  protected async process(input: GenerateFilesInput): Promise<GeneratedFile[]> {
    const { prd, design, assets } = input
    const assetManifestStr = JSON.stringify(assets, null, 2)
    const allFiles: GeneratedFile[] = []

    // ── Phase 1: types + config (parallel, no dependencies) ──────────────────
    this.emitProgress("Phase 1: 타입 정의 및 상수 파일 생성 중", 10)

    const [typesFile, configFile] = await Promise.all([
      this.generateSingleFile(
        "src/types/index.ts",
        design.typeDefinitions,
        "",
        assetManifestStr,
        1
      ),
      this.generateSingleFile(
        "src/config/constants.ts",
        design.configConstants,
        "",
        assetManifestStr,
        1
      ),
    ])

    allFiles.push(typesFile, configFile)
    this.emitProgress("Phase 1 완료: types + config 생성됨", 20)

    // ── Phase 2: objects (parallel, depend on phase 1) ────────────────────────
    this.emitProgress("Phase 2: 게임 오브젝트 파일 생성 중", 25)

    const phase1Deps = [
      `=== src/types/index.ts ===\n${typesFile.content}`,
      `=== src/config/constants.ts ===\n${configFile.content}`,
    ].join("\n\n")

    const objectFiles = await Promise.all(
      design.objects.map((obj) =>
        this.generateSingleFile(
          `src/objects/${obj.name}.ts`,
          obj.description,
          phase1Deps,
          assetManifestStr,
          2
        )
      )
    )

    allFiles.push(...objectFiles)
    this.emitProgress("Phase 2 완료: 게임 오브젝트 생성됨", 40)

    // ── Phase 3: scenes (sequential, depend on phase 1 + phase 2) ────────────
    this.emitProgress("Phase 3: 씬 파일 순차 생성 중", 45)

    const phase2Deps = objectFiles
      .map((f) => `=== ${f.path} ===\n${f.content}`)
      .join("\n\n")

    const sceneFiles: GeneratedFile[] = []
    let accumulatedSceneDeps = [phase1Deps, phase2Deps].join("\n\n")

    // Fixed scenes: Boot → Menu → Game
    const bootFile = await this.generateSingleFile(
      "src/scenes/BootScene.ts",
      "BootScene: 게임 초기화 씬. 기하 도형으로 애셋 생성 후 MenuScene으로 전환한다.",
      accumulatedSceneDeps,
      assetManifestStr,
      3
    )
    sceneFiles.push(bootFile)
    accumulatedSceneDeps += `\n\n=== src/scenes/BootScene.ts ===\n${bootFile.content}`
    this.emitProgress("Phase 3: BootScene 생성됨", 50)

    const menuFile = await this.generateSingleFile(
      "src/scenes/MenuScene.ts",
      "MenuScene: 타이틀과 시작 버튼을 표시하는 메뉴 씬. 버튼 클릭 시 GameScene으로 전환한다.",
      accumulatedSceneDeps,
      assetManifestStr,
      3
    )
    sceneFiles.push(menuFile)
    accumulatedSceneDeps += `\n\n=== src/scenes/MenuScene.ts ===\n${menuFile.content}`
    this.emitProgress("Phase 3: MenuScene 생성됨", 57)

    const gameSceneDescription = [
      "GameScene: 핵심 게임플레이 씬.",
      `코어 루프: ${prd.coreLoop}`,
      `수익화: ${prd.monetization}`,
      `KPI 지표: ${prd.kpiMetrics}`,
      "게임 종료 시 MenuScene 또는 다음 씬으로 전환한다.",
    ].join("\n")

    const gameFile = await this.generateSingleFile(
      "src/scenes/GameScene.ts",
      gameSceneDescription,
      accumulatedSceneDeps,
      assetManifestStr,
      3
    )
    sceneFiles.push(gameFile)
    accumulatedSceneDeps += `\n\n=== src/scenes/GameScene.ts ===\n${gameFile.content}`
    this.emitProgress("Phase 3: GameScene 생성됨", 65)

    // Additional scenes from design.scenes (excluding the three already generated)
    const fixedSceneNames = new Set(["BootScene", "MenuScene", "GameScene"])
    const additionalScenes = design.scenes.filter(
      (s) => !fixedSceneNames.has(s.name)
    )

    for (let i = 0; i < additionalScenes.length; i++) {
      const scene = additionalScenes[i]
      const additionalFile = await this.generateSingleFile(
        `src/scenes/${scene.name}.ts`,
        scene.description,
        accumulatedSceneDeps,
        assetManifestStr,
        3
      )
      sceneFiles.push(additionalFile)
      accumulatedSceneDeps += `\n\n=== src/scenes/${scene.name}.ts ===\n${additionalFile.content}`
      const progress = 65 + Math.round(((i + 1) / additionalScenes.length) * 15)
      this.emitProgress(`Phase 3: ${scene.name} 생성됨`, progress)
    }

    allFiles.push(...sceneFiles)
    this.emitProgress("Phase 3 완료: 모든 씬 생성됨", 80)

    // ── Phase 4: main.ts (depends on all previous results) ───────────────────
    this.emitProgress("Phase 4: main.ts 생성 중", 85)

    const allSceneNames = [
      "BootScene",
      "MenuScene",
      "GameScene",
      ...additionalScenes.map((s) => s.name),
    ]

    const mainDescription = [
      "src/main.ts: Phaser.Game 진입점 파일.",
      "Phaser.Game 인스턴스를 생성하고 아래 설정을 사용한다:",
      "  - type: Phaser.AUTO",
      "  - width: 800, height: 600",
      "  - physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } }",
      `  - scene: [${allSceneNames.join(", ")}]`,
      "  - parent: 'game-container' (선택적)",
      "  - backgroundColor: 팔레트의 background 색상",
      "모든 씬을 import하여 scene 배열에 등록해야 한다.",
    ].join("\n")

    const mainDeps = [
      accumulatedSceneDeps,
    ].join("\n\n")

    const mainFile = await this.generateSingleFile(
      "src/main.ts",
      mainDescription,
      mainDeps,
      assetManifestStr,
      4
    )
    allFiles.push(mainFile)

    this.emitProgress("Phase 4 완료: main.ts 생성됨", 95)

    return allFiles
  }

  protected buildSummary(result: GeneratedFile[]): NodeCompleteSummary {
    return {
      kind: "generate",
      fileCount: result.length,
    }
  }

  private async generateSingleFile(
    filePath: string,
    description: string,
    dependencies: string,
    assetManifest: string,
    phase: number
  ): Promise<GeneratedFile> {
    this.emitProgress(`생성 중: ${filePath}`, -1)

    const systemPrompt = buildGenerateFilePrompt(phase, description, dependencies, assetManifest)

    const response = await this.model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(
        `Generate the complete TypeScript source file for: ${filePath}\n\nOutput ONLY pure TypeScript code — no markdown code blocks, no backticks, no explanations.`
      ),
    ])

    const raw = typeof response.content === "string"
      ? response.content
      : response.content
          .filter((block): block is { type: "text"; text: string } => "type" in block && block.type === "text")
          .map((block) => block.text)
          .join("")

    const content = stripMarkdownCodeBlock(raw)

    return { path: filePath, content }
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strips markdown code block wrappers if the LLM accidentally wraps output.
 * Handles:
 *   ```typescript\n...\n```
 *   ```ts\n...\n```
 *   ```\n...\n```
 */
function stripMarkdownCodeBlock(text: string): string {
  const trimmed = text.trim()
  const fencePattern = /^```(?:typescript|ts|js|javascript)?\n([\s\S]*?)\n?```$/
  const match = trimmed.match(fencePattern)
  return match ? match[1].trim() : trimmed
}
