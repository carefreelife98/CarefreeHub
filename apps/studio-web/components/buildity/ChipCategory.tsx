"use client"

import { useState, useRef, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { SparklesIcon, XIcon, RefreshCwIcon, LoaderIcon, PlusIcon } from "lucide-react"
import type { Chip, ChipCategory, ChipSelection } from "@carefree-studio/shared"

interface Props {
  category: ChipCategory
  selection: ChipSelection
  onToggleChip: (categoryId: string, chipId: string) => void
  onRefresh: (categoryId: string, userPrompt?: string) => Promise<void>
  onOpenChipInput?: (categoryId: string) => void
}

export function ChipCategoryPanel({
  category,
  selection,
  onToggleChip,
  onRefresh,
  onOpenChipInput,
}: Props) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [promptValue, setPromptValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showPrompt) inputRef.current?.focus()
  }, [showPrompt])

  const handleRefresh = async (userPrompt?: string) => {
    setIsRefreshing(true)
    setShowPrompt(false)
    setPromptValue("")
    try {
      await onRefresh(category.categoryId, userPrompt)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handlePromptSubmit = () => {
    const trimmed = promptValue.trim()
    void handleRefresh(trimmed || undefined)
  }

  const handlePromptKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handlePromptSubmit()
    } else if (e.key === "Escape") {
      setShowPrompt(false)
      setPromptValue("")
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {isRefreshing ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-muted animate-pulse" />
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 w-20 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{category.icon}</span>
              <span className="font-display font-bold text-sm text-foreground">
                {category.label}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => void handleRefresh()}
                disabled={isRefreshing}
                className="p-1.5 rounded-lg text-muted-foreground/60 hover:text-primary hover:bg-muted transition-colors disabled:opacity-50"
                aria-label="랜덤 새로고침"
                title="카테고리 전체를 새로운 주제로 교체합니다"
              >
                {isRefreshing ? (
                  <LoaderIcon className="size-3.5 animate-spin" />
                ) : (
                  <RefreshCwIcon className="size-3.5" />
                )}
              </button>
              <button
                onClick={() => setShowPrompt((prev) => !prev)}
                disabled={isRefreshing}
                className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                  showPrompt
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground/60 hover:text-primary hover:bg-muted"
                }`}
                aria-label="AI로 수정"
                title="AI 프롬프트로 카테고리를 원하는 방향으로 변경합니다"
              >
                <SparklesIcon className="size-3.5" />
              </button>
            </div>
          </div>

          {showPrompt && (
            <div className="flex items-center gap-2 mb-3 animate-in slide-in-from-top-2 duration-200">
              <input
                ref={inputRef}
                type="text"
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                onKeyDown={handlePromptKeyDown}
                placeholder="예: 구독 기반으로 바꿔줘"
                className="flex-1 h-9 px-3 text-sm rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={handlePromptSubmit}
                className="h-9 px-3 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Enter
              </button>
              <button
                onClick={() => {
                  setShowPrompt(false)
                  setPromptValue("")
                }}
                aria-label="닫기"
                title="프롬프트 입력 닫기"
                className="p-1.5 rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
              >
                <XIcon className="size-3.5" />
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {category.chips.map((chip) => {
              const isSelected = selection.selectedChipIds.includes(chip.chipId)
              return (
                <button
                  key={chip.chipId}
                  onClick={() => onToggleChip(category.categoryId, chip.chipId)}
                  className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium border transition-all duration-200 ${
                    isSelected
                      ? "bg-primary/10 border-primary/30 text-primary ring-1 ring-primary/20"
                      : "bg-card border border-border text-muted-foreground hover:border-primary/20 hover:text-foreground"
                  }`}
                >
                  {chip.label}
                  {chip.isCustom && <span className="text-muted-foreground/60">*</span>}
                </button>
              )
            })}
            {onOpenChipInput && (
              <button
                onClick={() => onOpenChipInput(category.categoryId)}
                className="inline-flex items-center gap-1 h-9 px-4 rounded-lg text-sm font-medium border border-dashed border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-all"
              >
                <PlusIcon className="size-3.5" />
                직접 입력
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
