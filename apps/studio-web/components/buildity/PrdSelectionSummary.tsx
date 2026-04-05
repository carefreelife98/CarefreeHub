"use client"

import { useState, useEffect } from "react"
import { ChevronDownIcon, ChevronUpIcon, LayersIcon } from "lucide-react"
import type { BuildityStep } from "@carefree-studio/shared"

const STEP_LABELS: Record<string, string> = {
  core_loop: "코어 루프",
  monetization: "수익화",
  target_user: "타겟 유저",
  art_style: "아트 스타일",
  tech_spec: "기술 스펙",
  kpi: "KPI",
}

interface StepChipData {
  categories: { categoryId: string; label: string; chips: { chipId: string; label: string }[] }[]
  selections: { categoryId: string; selectedChipIds: string[] }[]
}

interface Props {
  steps: BuildityStep[]
}

function useStepDataMap() {
  const [data, setData] = useState<Record<string, StepChipData>>({})
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("buildity_step_data")
      if (raw) setData(JSON.parse(raw))
    } catch {}
  }, [])
  return data
}

function getSelectedCount(step: BuildityStep): number {
  return step.selections.reduce((sum, sel) => sum + sel.selectedChipIds.length, 0)
}

function getTopLabels(
  step: BuildityStep,
  dataMap: Record<string, StepChipData>,
  max: number
): string[] {
  const data = dataMap[step.stepId]
  if (!data?.categories) return []
  return step.selections
    .flatMap((sel) => {
      const cat = data.categories.filter(Boolean).find((c) => c.categoryId === sel.categoryId)
      if (!cat) return []
      return sel.selectedChipIds
        .map((chipId) => cat.chips.find((ch) => ch.chipId === chipId)?.label)
        .filter((l): l is string => !!l)
    })
    .slice(0, max)
}

export function PrdSelectionSummary({ steps }: Props) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  const dataMap = useStepDataMap()

  if (steps.length === 0) return null

  const totalSelected = steps.reduce((sum, s) => sum + getSelectedCount(s), 0)

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header — always visible, compact summary */}
      <div className="px-4 py-3 flex items-center gap-3">
        <LayersIcon className="size-4 text-primary flex-shrink-0" />
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto">
          {steps.map((step) => {
            const count = getSelectedCount(step)
            const isExpanded = expandedStep === step.stepId
            return (
              <button
                key={step.stepId}
                onClick={() => setExpandedStep(isExpanded ? null : step.stepId)}
                className={`flex-shrink-0 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  isExpanded
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {STEP_LABELS[step.stepId] ?? step.stepId}
                <span
                  className={`rounded-full px-1.5 py-px text-[10px] font-bold ${
                    isExpanded
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-background text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
        <span className="text-[10px] text-muted-foreground flex-shrink-0">
          {totalSelected}개 선택
        </span>
      </div>

      {/* Expanded detail for selected step */}
      {expandedStep && (
        <div className="px-4 pb-3 border-t border-border pt-3">
          {(() => {
            const step = steps.find((s) => s.stepId === expandedStep)
            const data = step ? dataMap[step.stepId] : null
            if (!step || !data?.categories) return null

            return (
              <div className="space-y-2">
                {step.selections.map((sel) => {
                  const cat = data.categories
                    .filter(Boolean)
                    .find((c) => c.categoryId === sel.categoryId)
                  const labels = sel.selectedChipIds
                    .map((chipId) => cat?.chips.find((ch) => ch.chipId === chipId)?.label)
                    .filter((l): l is string => !!l)
                  if (labels.length === 0) return null

                  return (
                    <div key={sel.categoryId} className="flex items-baseline gap-2">
                      <span className="text-[10px] text-muted-foreground/60 flex-shrink-0 w-20 text-right">
                        {cat?.label ?? ""}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {labels.map((label) => (
                          <span
                            key={label}
                            className="inline-flex items-center rounded px-1.5 py-px text-[10px] font-medium bg-primary/8 text-primary"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
