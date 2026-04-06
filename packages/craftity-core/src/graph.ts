// packages/craftity-core/src/graph.ts

import { StateGraph, Annotation, START, END } from "@langchain/langgraph"
import type {
  NodeEventEmitter,
  LlmConfig,
  CraftityRequest,
  ParsedPrd,
  ProjectDesign,
  AssetManifest,
  GeneratedFile,
  ValidationResult,
  CraftityResult,
} from "@carefree-studio/shared"
import { ParsePrdNode } from "./nodes/parse-prd.node.js"
import { DesignStructureNode } from "./nodes/design-structure.node.js"
import { SetupAssetsNode } from "./nodes/setup-assets.node.js"
import { GenerateFilesNode } from "./nodes/generate-files.node.js"
import { AstValidateNode } from "./nodes/ast-validate.node.js"
import type { AstValidateDeps } from "./nodes/ast-validate.node.js"
import { FinalizeNode } from "./nodes/finalize.node.js"

const DEFAULT_CRAFTITY_LLM_CONFIG: LlmConfig = {
  provider: "openai",
  model: "gpt-4.1",
}

const CraftityAnnotation = Annotation.Root({
  // Input
  request: Annotation<CraftityRequest>,
  // Nodes
  parsedPrd: Annotation<ParsedPrd>,
  design: Annotation<ProjectDesign>,
  assets: Annotation<AssetManifest>,
  files: Annotation<GeneratedFile[]>,
  validation: Annotation<ValidationResult>,
  result: Annotation<CraftityResult>,
  // Meta
  llmCallCount: Annotation<number>,
  startTimeMs: Annotation<number>,
})

type CraftityState = typeof CraftityAnnotation.State

export function buildCraftityGraph(
  emitter: NodeEventEmitter,
  deps: AstValidateDeps,
  llmConfig: LlmConfig = DEFAULT_CRAFTITY_LLM_CONFIG
) {
  const parsePrd = new ParsePrdNode(emitter, "craftity", llmConfig)
  const designStructure = new DesignStructureNode(emitter, "craftity", llmConfig)
  const setupAssets = new SetupAssetsNode(emitter, "craftity", llmConfig)
  const generateFiles = new GenerateFilesNode(emitter, "craftity", llmConfig)
  const astValidate = new AstValidateNode(emitter, "craftity", llmConfig, deps)
  const finalize = new FinalizeNode(emitter, "craftity")

  const graph = new StateGraph(CraftityAnnotation)
    .addNode("parse-prd", async (state: CraftityState) => {
      const result = await parsePrd.execute(state.request.prdMarkdown)
      return {
        parsedPrd: result,
        llmCallCount: (state.llmCallCount ?? 0) + 1,
      }
    })
    .addNode("design-structure", async (state: CraftityState) => {
      const result = await designStructure.execute(state.parsedPrd)
      return {
        design: result,
        llmCallCount: (state.llmCallCount ?? 0) + 1,
      }
    })
    .addNode("setup-assets", async (state: CraftityState) => {
      const result = await setupAssets.execute(state.parsedPrd)
      return {
        assets: result,
        llmCallCount: (state.llmCallCount ?? 0) + 1,
      }
    })
    .addNode("generate-files", async (state: CraftityState) => {
      const result = await generateFiles.execute({
        prd: state.parsedPrd,
        design: state.design,
        assets: state.assets,
      })
      return {
        files: result,
        llmCallCount: (state.llmCallCount ?? 0) + 1,
      }
    })
    .addNode("ast-validate", async (state: CraftityState) => {
      const result = await astValidate.execute({ files: state.files })
      return {
        files: result.files,
        validation: result.validation,
        llmCallCount: (state.llmCallCount ?? 0) + 1,
      }
    })
    .addNode("finalize", async (state: CraftityState) => {
      const executionTimeMs = Date.now() - (state.startTimeMs ?? Date.now())
      const result = await finalize.execute({
        files: state.files,
        assets: state.assets,
        design: state.design,
        validation: state.validation,
        gameTitle: state.parsedPrd.title,
        llmProvider: (state.request.llm?.provider ?? llmConfig.provider),
        executionTimeMs,
        llmCallCount: state.llmCallCount ?? 0,
      })
      return { result }
    })
    .addEdge(START, "parse-prd")
    .addEdge("parse-prd", "design-structure")
    .addEdge("design-structure", "setup-assets")
    .addEdge("setup-assets", "generate-files")
    .addEdge("generate-files", "ast-validate")
    .addEdge("ast-validate", "finalize")
    .addEdge("finalize", END)

  return graph.compile()
}
