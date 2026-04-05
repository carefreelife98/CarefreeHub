"use client"

import { use, useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalysisProgress } from "@/components/gentity/AnalysisProgress"
import { CompetitorGrid } from "@/components/gentity/CompetitorGrid"
import { InsightPanel } from "@/components/gentity/InsightPanel"
import { ConceptCard } from "@/components/gentity/ConceptCard"
import { Loader as LoaderIcon, ArrowRight as ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import { KpiCards } from "@/components/gentity/KpiCards"
import { ScoreDistChart } from "@/components/gentity/ScoreDistChart"
import { GenreDistChart } from "@/components/gentity/GenreDistChart"
import type { GentityReport } from "@carefree-studio/shared"
import { getAnalysisResult } from "@/lib/api/gentity"

interface PageProps {
  params: Promise<{ analysisId: string }>
}

export default function AnalysisPage({ params }: PageProps) {
  const { analysisId } = use(params)
  const searchParams = useSearchParams()
  const provider = (searchParams.get("provider") ?? "anthropic") as "anthropic" | "openai"
  const model = searchParams.get("model") ?? "claude-sonnet-4-6"
  const [isComplete, setIsComplete] = useState(false)
  const [report, setReport] = useState<GentityReport | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const handleComplete = useCallback(() => {
    setIsComplete(true)
  }, [])

  useEffect(() => {
    if (!isComplete) return

    getAnalysisResult(analysisId)
      .then((data) => {
        if (data) {
          setReport(data)
        } else {
          setFetchError("결과를 불러오지 못했습니다.")
        }
      })
      .catch(() => setFetchError("네트워크 오류"))
  }, [isComplete, analysisId])

  if (!isComplete) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-display text-2xl font-black tracking-tight text-primary mb-2">
            ANALYZING
          </h1>
          <p className="text-muted-foreground text-sm font-mono">{analysisId}</p>
        </div>
        <AnalysisProgress analysisId={analysisId} onComplete={handleComplete} />
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-destructive">{fetchError}</p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <LoaderIcon className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  const tabTriggerClass =
    "px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* PRD CTA — 최상단 */}
      <div className="flex items-center justify-between rounded-xl border border-buildity/20 bg-buildity-dim p-5 mb-8">
        <div>
          <p className="font-display font-bold text-sm text-buildity">Buildity 준비 완료</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            이 컨셉을 기반으로 6단계 PRD를 생성합니다
          </p>
        </div>
        <Link
          href={`/buildity/steps?analysisId=${report.analysisId}${provider ? `&provider=${provider}` : ""}${model ? `&model=${encodeURIComponent(model)}` : ""}`}
          className="bg-buildity text-primary-foreground rounded-xl px-5 py-2.5 font-display font-bold text-sm inline-flex items-center gap-2 hover:brightness-110 transition-all"
        >
          PRD 생성하기
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="font-display text-2xl font-black tracking-tight text-foreground mb-1">
          분석 완료
        </h1>
        <p className="text-muted-foreground text-sm">
          &ldquo;{report.query}&rdquo; — {report.competitors.length}개 경쟁작,{" "}
          {report.meta.totalReviewsAnalyzed}개 리뷰 분석
        </p>
      </div>

      {/* KPI Cards */}
      <KpiCards competitors={report.competitors} totalReviews={report.meta.totalReviewsAnalyzed} />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <ScoreDistChart competitors={report.competitors} />
        <GenreDistChart competitors={report.competitors} />
      </div>

      {/* Search Reason */}
      {report.searchReason && (
        <div className="rounded-xl border-l-4 border-l-gentity bg-gentity-dim p-5 mt-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-display font-bold text-gentity">경쟁작 선정 이유</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{report.searchReason}</p>
        </div>
      )}

      <Tabs defaultValue="competitors" className="mt-8">
        <TabsList className="bg-transparent border-b border-border rounded-none mb-6 h-auto p-0">
          <TabsTrigger value="competitors" className={tabTriggerClass}>
            경쟁작 리포트
          </TabsTrigger>
          <TabsTrigger value="insights" className={tabTriggerClass}>
            유저 인사이트
          </TabsTrigger>
          <TabsTrigger value="concept" className={tabTriggerClass}>
            AI 게임 컨셉
          </TabsTrigger>
        </TabsList>
        <TabsContent value="competitors">
          <CompetitorGrid competitors={report.competitors} />
        </TabsContent>
        <TabsContent value="insights">
          <InsightPanel insights={report.insights} />
        </TabsContent>
        <TabsContent value="concept">
          <ConceptCard concept={report.concept} analysisId={report.analysisId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
