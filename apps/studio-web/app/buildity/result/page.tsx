"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { PrdPreview } from "@/components/buildity/PrdPreview"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { GameConcept, BuildityStep, LlmConfig } from "@carefree-studio/shared"

function ResultContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const analysisId = searchParams.get("analysisId") ?? undefined
  const [concept, setConcept] = useState<GameConcept | null>(null)
  const [steps, setSteps] = useState<BuildityStep[] | null>(null)
  const [llmConfig, setLlmConfig] = useState<LlmConfig | undefined>(undefined)
  const [selectedLlm, setSelectedLlm] = useState("openai")
  const [prdMarkdown, setPrdMarkdown] = useState<string | null>(null)

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

  const handleMakeGame = () => {
    const markdown = prdMarkdown ?? sessionStorage.getItem("buildity_prd_markdown") ?? ""
    sessionStorage.setItem("craftity-prd", markdown)
    sessionStorage.setItem("craftity-llm", selectedLlm)
    router.push("/craftity/new")
  }

  if (!concept || !steps) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-muted-foreground">스텝 데이터를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 space-y-6">
      <PrdPreview
        concept={concept}
        steps={steps}
        llmConfig={llmConfig}
        onBack={handleBack}
        onMarkdownReady={(md: string) => {
          setPrdMarkdown(md)
          sessionStorage.setItem("buildity_prd_markdown", md)
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle>이 PRD로 게임 만들기</CardTitle>
          <CardDescription>AI가 Phaser 3 게임 코드를 자동 생성합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <select
              value={selectedLlm}
              onChange={(e) => setSelectedLlm(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="openai">GPT (OpenAI)</option>
              <option value="anthropic">Claude (Anthropic)</option>
            </select>
            <Button onClick={handleMakeGame} size="sm">
              게임 만들기
            </Button>
          </div>
        </CardContent>
      </Card>
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
