// packages/shared/src/types/buildity.ts

import type { GameConcept, LlmConfig } from "./gentity.js"

export type StepId =
  | "core_loop"
  | "monetization"
  | "target_user"
  | "art_style"
  | "tech_spec"
  | "kpi"

export interface BuildityStep {
  stepId: StepId
  selections: ChipSelection[]
}

export interface ChipCategory {
  categoryId: string
  label: string
  icon: string
  chips: Chip[]
}

export interface Chip {
  chipId: string
  label: string
  isCustom: boolean
}

export interface ChipSelection {
  categoryId: string
  selectedChipIds: string[]
}

export interface ChipGenerateRequest {
  stepId: StepId
  concept: GameConcept
  previousSteps: BuildityStep[]
  analysisId?: string
  llm?: LlmConfig
}

export interface ChipRefreshRequest {
  stepId: StepId
  categoryId: string
  concept: GameConcept
  previousSteps: BuildityStep[]
  currentSelections: string[]
  excludeChipLabels: string[]
  userPrompt?: string
  llm?: LlmConfig
}

export interface ChipGenerateResponse {
  categories: ChipCategory[]
  insightHint: InsightHint
}

export interface InsightHint {
  title: string
  description: string
  highlightValues: HighlightValue[]
}

export interface HighlightValue {
  text: string
  position: number
}

export interface PrdBuildRequest {
  concept: GameConcept
  steps: BuildityStep[]
  llm?: LlmConfig
}

export interface PrdBuildResponse {
  markdown: string
  generatedAt: Date
}
