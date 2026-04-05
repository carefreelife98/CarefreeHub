"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchIcon, ArrowRightIcon } from "lucide-react"
import type { GameConcept } from "@carefree-studio/shared"
import { getAnalysisResult } from "@/lib/api/gentity"

function BuildityContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const analysisId = searchParams.get("analysisId")
  const [concept, setConcept] = useState<GameConcept | null>(null)
  const [manualInput, setManualInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!analysisId) return
    setIsLoading(true)
    getAnalysisResult(analysisId)
      .then((data) => {
        if (data?.concept) {
          setConcept(data.concept)
        }
      })
      .finally(() => setIsLoading(false))
  }, [analysisId])

  const handleStart = () => {
    sessionStorage.removeItem("buildity_step_data")
    sessionStorage.removeItem("buildity_step_index")
    if (concept) {
      const params = new URLSearchParams()
      if (analysisId) params.set("analysisId", analysisId)
      router.push(`/buildity/steps?${params.toString()}`)
    } else if (manualInput.trim()) {
      const manualConcept: GameConcept = {
        title: manualInput.trim(),
        coreLoop: "",
        mechanics: [],
        targetUser: "",
        differentiation: "",
        monetization: "",
        cpiTestPlan: "",
        markdown: "",
      }
      sessionStorage.setItem("buildity_concept", JSON.stringify(manualConcept))
      router.push("/buildity/steps")
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-buildity/30 border-t-buildity animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-black tracking-tight text-foreground mb-2">
          <span className="text-buildity">BUILDITY</span>
        </h1>
        <p className="text-muted-foreground mt-2">게임 컨셉을 기반으로 6단계 PRD를 완성합니다</p>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        {concept ? (
          <div className="rounded-xl border border-border bg-card p-6 space-y-3 shadow-sm hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
            <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wider">
              Gentity 분석 결과
            </p>
            <h2 className="font-display text-xl font-bold text-buildity">{concept.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{concept.targetUser}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">게임 컨셉 직접 입력</label>
            <textarea
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="게임 컨셉을 간략히 설명해주세요. 예: 음식점 경영 시뮬레이션 게임으로, 요리사를 고용하고 메뉴를 확장하는 아이들 게임"
              className="w-full h-32 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 text-sm p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>
        )}

        <Button
          onClick={handleStart}
          disabled={!concept && !manualInput.trim()}
          className="w-full h-12 bg-buildity text-primary-foreground rounded-xl px-6 py-3 font-display font-bold hover:bg-buildity/90 transition-colors"
        >
          PRD 만들기
        </Button>

        <div className="relative flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">또는</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <Link
          href="/gentity"
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <SearchIcon className="size-4" />
          Gentity 로 게임 컨셉 생성하기
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </div>
  )
}

export default function BuildityPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-buildity/30 border-t-buildity animate-spin" />
        </div>
      }
    >
      <BuildityContent />
    </Suspense>
  )
}
