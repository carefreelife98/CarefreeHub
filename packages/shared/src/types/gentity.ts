// packages/shared/src/types/gentity.ts

import type { Platform } from "./events.js"

export type GameGenre =
  | "casual"
  | "simulation"
  | "arcade"
  | "puzzle"
  | "action"
  | "strategy"
  | "rpg"

export type GameMechanic =
  | "idle"
  | "tycoon"
  | "merge"
  | "match3"
  | "runner"
  | "tower_defense"
  | "management"
  | "cooking"
  | "building"

export type LlmProvider = "anthropic" | "openai"

export interface LlmConfig {
  provider: LlmProvider
  model: string
  maxTokens?: number
}

export const DEFAULT_LLM_CONFIG: LlmConfig = {
  provider: "openai",
  model: "gpt-5.1",
}

export interface AnalyzeRequest {
  query: string
  genre?: GameGenre
  maxCompetitors?: number
  reviewsPerApp?: number
  llm?: LlmConfig
}

export interface ParsedParams {
  keywords: string[]
  keywordsKo: string[]
  genre: GameGenre
  mechanics: GameMechanic[]
}

export interface Competitor {
  appId: string
  platform: Platform
  title: string
  score: number
  ratings: number
  installs: string
  genre: string
  description: string
  iconUrl: string
}

export interface AppReview {
  reviewId: string
  competitorAppId: string
  platform: Platform
  text: string
  score: 1 | 2 | 3 | 4 | 5
  thumbsUp: number
  createdAt: Date
}

export interface ReviewSample {
  platform: Platform
  text: string
  score: 1 | 2 | 3 | 4 | 5
  thumbsUp: number
  competitorTitle?: string
}

export interface ReviewInsights {
  topStrengths: ReviewSample[]
  topPainPoints: ReviewSample[]
  unmetNeeds: ReviewSample[]
  trendPatterns: ReviewSample[]
}

export interface GameConcept {
  title: string
  coreLoop: string
  mechanics: string[]
  targetUser: string
  differentiation: string
  monetization: string
  cpiTestPlan: string
  markdown: string
}

export interface VerificationResult {
  passed: boolean
  criteria: {
    name: string
    passed: boolean
    evidence: string
  }[]
  feedback: string
  retryCount: number
}

export interface GentityReport {
  analysisId: string
  query: string
  parsedParams: ParsedParams
  competitors: Competitor[]
  insights: ReviewInsights
  concept: GameConcept
  searchReason?: string
  meta: {
    totalReviewsAnalyzed: number
    llmCallCount: number
    executionTimeMs: number
  }
}
