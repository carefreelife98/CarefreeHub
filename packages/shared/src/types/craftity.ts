import type { LlmConfig } from "./gentity.js"

/* ── Inputs ── */

export interface CraftityRequest {
  prdMarkdown: string
  prdId?: string
  llm?: LlmConfig
}

/* ── Intermediate Types ── */

export interface ParsedPrd {
  title: string
  overview: string
  coreLoop: string
  monetization: string
  targetUser: string
  artStyle: string
  techSpec: string
  kpiMetrics: string
}

export interface SceneDesign {
  name: string
  fileName: string
  description: string
  publicMethods: string[]
}

export interface ObjectDesign {
  name: string
  fileName: string
  description: string
  publicInterface: string
}

export interface ProjectDesign {
  scenes: SceneDesign[]
  objects: ObjectDesign[]
  typeDefinitions: string
  configConstants: string
}

export interface AssetPlaceholder {
  name: string
  shape: "rectangle" | "circle" | "triangle"
  color: string
  width: number
  height: number
  role: string
}

export interface AssetManifest {
  palette: string[]
  placeholders: AssetPlaceholder[]
}

export interface GeneratedFile {
  path: string
  content: string
}

export interface ValidationError {
  file: string
  line: number
  column: number
  message: string
  code: number
}

export interface ValidationResult {
  passed: boolean
  errors: ValidationError[]
  attempt: number
}

/* ── Outputs ── */

export interface CraftityResult {
  gameId: string
  versionId: string
  files: GeneratedFile[]
  assets: AssetManifest
  design: ProjectDesign
  validation: ValidationResult
  meta: {
    executionTimeMs: number
    llmCallCount: number
    llmProvider: string
  }
}

/* ── SSE Events ── */

export type CraftityEventType =
  | "status"
  | "design"
  | "assets"
  | "file-start"
  | "file-chunk"
  | "file-done"
  | "validate"
  | "finalize"

export interface CraftityStatusEvent {
  type: "status"
  phase: string
  message: string
}

export interface CraftityDesignEvent {
  type: "design"
  design: ProjectDesign
}

export interface CraftityAssetsEvent {
  type: "assets"
  assets: AssetManifest
}

export interface CraftityFileStartEvent {
  type: "file-start"
  path: string
  phase: number
}

export interface CraftityFileChunkEvent {
  type: "file-chunk"
  path: string
  chunk: string
}

export interface CraftityFileDoneEvent {
  type: "file-done"
  path: string
  size: number
}

export interface CraftityValidateEvent {
  type: "validate"
  status: "checking" | "error" | "pass"
  attempt?: number
  errors?: ValidationError[]
  retrying?: boolean
  filesValidated?: number
}

export interface CraftityFinalizeEvent {
  type: "finalize"
  gameId: string
  versionId: string
  totalFiles: number
}

export type CraftityEvent =
  | CraftityStatusEvent
  | CraftityDesignEvent
  | CraftityAssetsEvent
  | CraftityFileStartEvent
  | CraftityFileChunkEvent
  | CraftityFileDoneEvent
  | CraftityValidateEvent
  | CraftityFinalizeEvent
