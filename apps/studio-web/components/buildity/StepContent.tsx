"use client"

import { ChipCategoryPanel } from "./ChipCategory"
import { Streamdown } from "streamdown"
import { cjk } from "@streamdown/cjk"
import "streamdown/styles.css"
import { CheckCircle2Icon, LoaderIcon, CircleIcon, LightbulbIcon } from "lucide-react"
import type { StepData } from "./useStepData"

interface Props {
  stepData: StepData | undefined
  isLoading: boolean
  chipPlan: { total: number; labels: string[] } | null
  retryInfo: { attempt: number; maxRetries: number; label: string } | null
  onToggleChip: (categoryId: string, chipId: string) => void
  onRefreshCategory: (categoryId: string, userPrompt?: string) => Promise<void>
  onOpenChipInput: (categoryId: string) => void
}

function ChipPlanProgress({
  labels,
  stepData,
}: {
  labels: string[]
  stepData: StepData | undefined
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[10px]">
      {labels.map((label, i) => {
        const done = stepData?.categories[i] != null
        const isLast = i === labels.length - 1
        const isLoading = !done && i === (stepData?.categories.filter(Boolean).length ?? 0)
        return (
          <div key={i} className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              {done ? (
                <CheckCircle2Icon className="size-3.5 text-primary" />
              ) : isLoading ? (
                <LoaderIcon className="size-3.5 text-primary animate-spin" />
              ) : (
                <CircleIcon className="size-3.5 text-muted-foreground/40" />
              )}
              <span className={done ? "text-foreground font-medium" : "text-muted-foreground/60"}>
                {label}
              </span>
            </div>
            {!isLast && <div className="h-px w-4 bg-border ml-2" />}
          </div>
        )
      })}
    </div>
  )
}

function CategorySkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-4 rounded-xl bg-muted animate-pulse w-24" />
      <div className="flex gap-2">
        {[1, 2, 3].map((j) => (
          <div key={j} className="h-8 w-16 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export function StepContent({
  stepData,
  isLoading,
  chipPlan,
  retryInfo,
  onToggleChip,
  onRefreshCategory,
  onOpenChipInput,
}: Props) {
  // Full loading state (no categories yet)
  if (isLoading && (!stepData || stepData.categories.filter(Boolean).length === 0)) {
    return (
      <div className="space-y-6">
        {retryInfo && (
          <p className="text-xs text-amber-600 dark:text-amber-400 font-mono">
            재시도 중... ({retryInfo.attempt}/{retryInfo.maxRetries}) — {retryInfo.label}
          </p>
        )}
        {chipPlan ? (
          <div className="space-y-4">
            <ChipPlanProgress labels={chipPlan.labels} stepData={stepData} />
            {chipPlan.labels.map(
              (_, i) => stepData?.categories[i] == null && <CategorySkeleton key={i} />
            )}
          </div>
        ) : (
          <>
            <CategorySkeleton />
            <CategorySkeleton />
          </>
        )}
      </div>
    )
  }

  if (!stepData) return null

  const insightContent = stepData.insightHint ? (
    <div className="rounded-xl border border-border bg-card p-5 sticky top-20">
      <div className="flex items-center gap-2 mb-3">
        <LightbulbIcon className="size-4 text-primary" />
        <span className="font-display font-bold text-primary text-sm">Insight</span>
      </div>
      <Streamdown
        plugins={{ cjk }}
        isAnimating={isLoading}
        mode={isLoading ? "streaming" : "static"}
      >
        {stepData.insightHint}
      </Streamdown>
    </div>
  ) : isLoading ? (
    <div className="rounded-xl border border-border bg-card p-5 space-y-2 sticky top-20">
      <div className="h-4 rounded-lg bg-muted animate-pulse w-32" />
      <div className="h-3 rounded-lg bg-muted animate-pulse w-full" />
      <div className="h-3 rounded-lg bg-muted animate-pulse w-3/4" />
    </div>
  ) : null

  return (
    <div className="space-y-6">
      {chipPlan && <ChipPlanProgress labels={chipPlan.labels} stepData={stepData} />}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left: Chip categories */}
        <div className="space-y-4">
          {stepData.categories.filter(Boolean).map((category) => {
            const sel = stepData.selections.find((s) => s.categoryId === category.categoryId) ?? {
              categoryId: category.categoryId,
              selectedChipIds: [],
            }
            return (
              <ChipCategoryPanel
                key={category.categoryId}
                category={category}
                selection={sel}
                onToggleChip={onToggleChip}
                onRefresh={onRefreshCategory}
                onOpenChipInput={onOpenChipInput}
              />
            )
          })}

          {chipPlan &&
            isLoading &&
            chipPlan.labels.map(
              (_, i) => stepData.categories[i] == null && <CategorySkeleton key={`skeleton-${i}`} />
            )}
        </div>

        {/* Right: Insight panel (sticky) */}
        <div className="hidden lg:block">{insightContent}</div>
      </div>

      {/* Mobile: Insight below */}
      <div className="lg:hidden">{insightContent}</div>
    </div>
  )
}
