// apps/web/lib/api/gentity.ts

import type { GentityReport, AnalyzeRequest } from "@carefree-studio/shared"

export async function analyzeGame(request: AnalyzeRequest): Promise<{ analysisId: string }> {
  const res = await fetch("/api/gentity/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = (await res.json()) as { success: boolean; data: { analysisId: string } }
  return json.data
}

export async function getAnalysisResult(analysisId: string): Promise<GentityReport | null> {
  const res = await fetch(`/api/gentity/result/${analysisId}`)
  if (!res.ok) return null
  const json = (await res.json()) as { success: boolean; data?: GentityReport }
  return json.success && json.data ? json.data : null
}

export function createAnalysisEventSource(analysisId: string): EventSource {
  return new EventSource(`/api/gentity/analyze/${analysisId}/events`)
}

interface KeywordSuggestion {
  keyword: string
  genre: string
  description: string
}

export async function suggestKeywords(): Promise<KeywordSuggestion[]> {
  const res = await fetch("/api/gentity/suggest-keywords", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = (await res.json()) as { suggestions: KeywordSuggestion[] }
  return json.suggestions
}
