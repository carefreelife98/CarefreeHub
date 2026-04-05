"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { PrdPreview } from "@/components/buildity/PrdPreview"
import type { GameConcept, BuildityStep, LlmConfig } from "@carefree-studio/shared"

function ResultContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const analysisId = searchParams.get("analysisId") ?? undefined
  const [concept, setConcept] = useState<GameConcept | null>(null)
  const [steps, setSteps] = useState<BuildityStep[] | null>(null)
  const [llmConfig, setLlmConfig] = useState<LlmConfig | undefined>(undefined)

  useEffect(() => {
    const storedConcept = sessionStorage.getItem("buildity_concept")
    const storedSteps = sessionStorage.getItem("buildity_steps")
    const storedLlm = sessionStorage.getItem("buildity_llm")

    if (storedConcept) setConcept(JSON.parse(storedConcept) as GameConcept)
    if (storedSteps) setSteps(JSON.parse(storedSteps) as BuildityStep[])
    if (storedLlm) setLlmConfig(JSON.parse(storedLlm) as LlmConfig)
  }, [])

  const handleBack = () => {
    const params = analysisId ? `?analysisId=${analysisId}` : ""
    router.push(`/buildity/steps${params}`)
  }

  if (!concept || !steps) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-muted-foreground">스텝 데이터를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <PrdPreview concept={concept} steps={steps} llmConfig={llmConfig} onBack={handleBack} />
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-buildity/30 border-t-buildity animate-spin" />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  )
}
