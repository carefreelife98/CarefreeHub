"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { StepWizard } from "@/components/buildity/StepWizard"
import type { BuildityStep, GameConcept, LlmConfig } from "@carefree-studio/shared"
import { getAnalysisResult } from "@/lib/api/gentity"

function StepsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const analysisId = searchParams.get("analysisId") ?? undefined
  const urlProvider = (searchParams.get("provider") ?? "anthropic") as "anthropic" | "openai"
  const urlModel = searchParams.get("model") ?? "claude-sonnet-4-6"
  const initialLlmConfig: LlmConfig = { provider: urlProvider, model: urlModel }
  const [concept, setConcept] = useState<GameConcept | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (analysisId) {
      const prevAnalysisId = sessionStorage.getItem("buildity_analysis_id")
      if (prevAnalysisId !== analysisId) {
        sessionStorage.removeItem("buildity_step_data")
        sessionStorage.removeItem("buildity_step_index")
        sessionStorage.setItem("buildity_analysis_id", analysisId)
      }

      getAnalysisResult(analysisId)
        .then((data) => {
          if (data?.concept) {
            setConcept(data.concept)
          }
        })
        .finally(() => setIsLoading(false))
    } else {
      const stored = sessionStorage.getItem("buildity_concept")
      if (stored) {
        setConcept(JSON.parse(stored) as GameConcept)
      }
      setIsLoading(false)
    }
  }, [analysisId])

  const handleComplete = (steps: BuildityStep[], llmConfig: LlmConfig) => {
    sessionStorage.setItem("buildity_steps", JSON.stringify(steps))
    sessionStorage.setItem("buildity_llm", JSON.stringify(llmConfig))
    if (concept) {
      sessionStorage.setItem("buildity_concept", JSON.stringify(concept))
    }
    const params = analysisId ? `?analysisId=${analysisId}` : ""
    router.push(`/buildity/result${params}`)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-buildity/30 border-t-buildity animate-spin" />
      </div>
    )
  }

  if (!concept) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-muted-foreground">컨셉 정보를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <StepWizard
        concept={concept}
        analysisId={analysisId}
        initialLlmConfig={initialLlmConfig}
        onComplete={handleComplete}
      />
    </div>
  )
}

export default function StepsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-buildity/30 border-t-buildity animate-spin" />
        </div>
      }
    >
      <StepsContent />
    </Suspense>
  )
}
