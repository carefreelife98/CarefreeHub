// packages/craftity-core/src/nodes/finalize.node.ts

import { randomUUID } from "node:crypto"
import { BaseNode } from "./base.node.js"
import { generatePackageJson } from "../templates/package-json.js"
import { generateTsconfig } from "../templates/tsconfig-json.js"
import { generateViteConfig } from "../templates/vite-config.js"
import { generateIndexHtml } from "../templates/index-html.js"
import type { NodeCompleteSummary, NodeEventEmitter } from "@carefree-studio/shared"
import type {
  GeneratedFile,
  AssetManifest,
  ProjectDesign,
  ValidationResult,
  CraftityResult,
} from "@carefree-studio/shared"

export interface FinalizeInput {
  files: GeneratedFile[]
  assets: AssetManifest
  design: ProjectDesign
  validation: ValidationResult
  gameTitle: string
  llmProvider: string
  executionTimeMs: number
  llmCallCount: number
}

export class FinalizeNode extends BaseNode<FinalizeInput, CraftityResult> {
  readonly nodeId = "finalize"

  constructor(emitter: NodeEventEmitter, graphId: string) {
    super(emitter, graphId)
  }

  protected async process(input: FinalizeInput): Promise<CraftityResult> {
    this.emitProgress("템플릿 파일을 생성하고 있어요", 20)

    const templateFiles: GeneratedFile[] = [
      { path: "package.json", content: generatePackageJson(input.gameTitle) },
      { path: "tsconfig.json", content: generateTsconfig() },
      { path: "vite.config.ts", content: generateViteConfig() },
      { path: "index.html", content: generateIndexHtml(input.gameTitle) },
    ]

    this.emitProgress("파일을 합치고 있어요", 60)

    const allFiles = [...templateFiles, ...input.files]

    const gameId = randomUUID()
    const versionId = randomUUID()

    this.emitProgress("최종 결과를 준비하고 있어요", 90)

    return {
      gameId,
      versionId,
      files: allFiles,
      assets: input.assets,
      design: input.design,
      validation: input.validation,
      meta: {
        executionTimeMs: input.executionTimeMs,
        llmCallCount: input.llmCallCount,
        llmProvider: input.llmProvider,
      },
    }
  }

  protected buildSummary(result: CraftityResult): NodeCompleteSummary {
    return {
      kind: "finalize",
      totalFiles: result.files.length,
      passed: result.validation.passed,
    }
  }
}
