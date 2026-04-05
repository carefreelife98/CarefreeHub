"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type {
  StepId,
  BuildityStep,
  ChipCategory,
  ChipSelection,
  Chip,
  GameConcept,
  LlmConfig,
} from "@carefree-studio/shared"
import { streamChips, refreshChips } from "@/lib/api/buildity"

// Types not in shared
export interface StepData {
  categories: ChipCategory[]
  insightHint: string
  selections: ChipSelection[]
  loaded: boolean
}

export interface InsightHintData {
  title: string
  description: string
  highlightValues: { text: string; position: number }[]
}

export interface ChipGenerateResponse {
  categories: ChipCategory[]
  insightHint: InsightHintData
}

export const STEP_ORDER: StepId[] = [
  "core_loop",
  "monetization",
  "target_user",
  "art_style",
  "tech_spec",
  "kpi",
]

export const STEP_LABELS: Record<StepId, string> = {
  core_loop: "코어 루프",
  monetization: "수익화 모델",
  target_user: "타겟 유저",
  art_style: "아트 스타일",
  tech_spec: "기술 요구사항",
  kpi: "KPI & 성공 기준",
}

const SESSION_KEY = "buildity_step_data"
const SESSION_INDEX_KEY = "buildity_step_index"

function loadPersistedStepData(): Partial<Record<StepId, StepData>> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Partial<Record<StepId, StepData>>) : {}
  } catch {
    return {}
  }
}

function loadPersistedStepIndex(): number {
  try {
    const raw = sessionStorage.getItem(SESSION_INDEX_KEY)
    return raw ? parseInt(raw, 10) : 0
  } catch {
    return 0
  }
}

interface UseStepDataParams {
  concept: GameConcept
  analysisId?: string
  llmConfig: LlmConfig
  onComplete: (steps: BuildityStep[], llmConfig: LlmConfig) => void
}

export function useStepData({ concept, analysisId, llmConfig, onComplete }: UseStepDataParams) {
  const [currentStepIndex, setCurrentStepIndex] = useState(() => loadPersistedStepIndex())
  const [stepDataMap, setStepDataMap] = useState<Partial<Record<StepId, StepData>>>(() =>
    loadPersistedStepData()
  )
  const stepDataMapRef = useRef<Partial<Record<StepId, StepData>>>(loadPersistedStepData())
  const [loadingSteps, setLoadingSteps] = useState<Set<StepId>>(new Set())
  const loadingRef = useRef<Set<StepId>>(new Set())
  const [retryInfo, setRetryInfo] = useState<{
    attempt: number
    maxRetries: number
    label: string
  } | null>(null)
  const [chipPlan, setChipPlan] = useState<{ total: number; labels: string[] } | null>(null)
  const persistTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const abortRef = useRef<AbortController>(undefined)

  const currentStepId = STEP_ORDER[currentStepIndex]

  const updateStepDataMap = useCallback(
    (updater: (prev: Partial<Record<StepId, StepData>>) => Partial<Record<StepId, StepData>>) => {
      setStepDataMap((prev) => {
        const next = updater(prev)
        stepDataMapRef.current = next
        clearTimeout(persistTimeoutRef.current)
        persistTimeoutRef.current = setTimeout(() => {
          try {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(stepDataMapRef.current))
          } catch {}
        }, 500)
        return next
      })
    },
    []
  )

  const updateStepIndex = useCallback((updater: (i: number) => number) => {
    setCurrentStepIndex((prev) => {
      const next = updater(prev)
      try {
        sessionStorage.setItem(SESSION_INDEX_KEY, String(next))
      } catch {}
      return next
    })
  }, [])

  const getCompletedSteps = useCallback((): BuildityStep[] => {
    return STEP_ORDER.slice(0, currentStepIndex).map((stepId) => ({
      stepId,
      selections: stepDataMap[stepId]?.selections ?? [],
    }))
  }, [currentStepIndex, stepDataMap])

  const loadStepData = useCallback(
    async (stepId: StepId) => {
      if (stepDataMapRef.current[stepId]?.loaded) return
      if (loadingRef.current.has(stepId)) return

      abortRef.current?.abort()
      abortRef.current = new AbortController()
      const signal = abortRef.current.signal

      loadingRef.current.add(stepId)
      setLoadingSteps((prev) => new Set(prev).add(stepId))

      updateStepDataMap((prev) => {
        if (prev[stepId]?.loaded) return prev
        return {
          ...prev,
          [stepId]: {
            categories: [],
            insightHint: "",
            selections: [],
            loaded: false,
          },
        }
      })

      try {
        const res = await streamChips(
          { stepId, concept, analysisId, previousSteps: getCompletedSteps(), llm: llmConfig },
          signal
        )

        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const parts = buffer.split("\n\n")
          buffer = parts.pop() ?? ""

          for (const part of parts) {
            const lines = part.split("\n")
            const eventLine = lines.find((l) => l.startsWith("event: "))
            const dataLine = lines.find((l) => l.startsWith("data: "))
            if (!eventLine || !dataLine) continue

            const eventType = eventLine.slice(7).trim()
            if (eventType === "plan") {
              try {
                const { total, labels } = JSON.parse(dataLine.slice(6)) as {
                  total: number
                  labels: string[]
                }
                setChipPlan({ total, labels })
              } catch {}
            } else if (eventType === "category") {
              try {
                const { index, categoryId, label, icon, chips } = JSON.parse(dataLine.slice(6)) as {
                  index: number
                  categoryId: string
                  label: string
                  icon: string
                  chips: { chipId: string; label: string; isCustom: boolean }[]
                }
                const category = { categoryId, label, icon, chips }
                updateStepDataMap((prev) => {
                  const sd = prev[stepId]
                  if (!sd) return prev
                  const newCategories = [...sd.categories]
                  newCategories[index] = category
                  return {
                    ...prev,
                    [stepId]: {
                      ...sd,
                      categories: newCategories,
                      selections: [
                        ...sd.selections.filter((s) => s.categoryId !== categoryId),
                        { categoryId, selectedChipIds: [] },
                      ],
                    },
                  }
                })
              } catch {}
            } else if (eventType === "hint-chunk") {
              try {
                const { text } = JSON.parse(dataLine.slice(6)) as { text: string }
                updateStepDataMap((prev) => {
                  const sd = prev[stepId]
                  if (!sd) return prev
                  return { ...prev, [stepId]: { ...sd, insightHint: sd.insightHint + text } }
                })
              } catch {}
            } else if (eventType === "retry") {
              try {
                const { attempt, maxRetries, label } = JSON.parse(dataLine.slice(6)) as {
                  attempt: number
                  maxRetries: number
                  label: string
                }
                setRetryInfo({ attempt, maxRetries, label })
              } catch {}
            }
          }
        }

        setRetryInfo(null)
        setChipPlan(null)
        updateStepDataMap((prev) => {
          const sd = prev[stepId]
          if (!sd) return prev
          return { ...prev, [stepId]: { ...sd, loaded: true } }
        })
      } catch (err) {
        console.error("Failed to load chips:", err)
      } finally {
        loadingRef.current.delete(stepId)
        setLoadingSteps((prev) => {
          const next = new Set(prev)
          next.delete(stepId)
          return next
        })
      }
    },
    [concept, analysisId, llmConfig, getCompletedSteps, updateStepDataMap]
  )

  useEffect(() => {
    void loadStepData(currentStepId)
    return () => {
      abortRef.current?.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepId])

  const handleToggleChip = (categoryId: string, chipId: string) => {
    updateStepDataMap((prev) => {
      const stepData = prev[currentStepId]
      if (!stepData) return prev
      return {
        ...prev,
        [currentStepId]: {
          ...stepData,
          selections: stepData.selections.map((sel) =>
            sel.categoryId === categoryId
              ? {
                  ...sel,
                  selectedChipIds: sel.selectedChipIds.includes(chipId)
                    ? sel.selectedChipIds.filter((id) => id !== chipId)
                    : [...sel.selectedChipIds, chipId],
                }
              : sel
          ),
        },
      }
    })
  }

  const handleRefreshCategory = async (categoryId: string, userPrompt?: string) => {
    const stepData = stepDataMap[currentStepId]
    if (!stepData) return

    const currentCategory = stepData.categories.find((c) => c.categoryId === categoryId)
    const currentSelections = stepData.selections.find((s) => s.categoryId === categoryId)
    const excludeLabels =
      currentCategory?.chips
        .filter((ch) => !currentSelections?.selectedChipIds.includes(ch.chipId))
        .map((ch) => ch.label) ?? []

    const newCategory = await refreshChips({
      stepId: currentStepId,
      categoryId,
      concept,
      previousSteps: getCompletedSteps(),
      currentSelections: currentSelections?.selectedChipIds ?? [],
      excludeChipLabels: excludeLabels,
      userPrompt,
      llm: llmConfig,
    })

    updateStepDataMap((prev) => {
      const sd = prev[currentStepId]
      if (!sd) return prev

      if (userPrompt) {
        // Prompt-based: ADD new chips to existing category
        const existingCat = sd.categories.find((c) => c.categoryId === categoryId)
        if (!existingCat) return prev
        const mergedCategory = {
          ...existingCat,
          chips: [
            ...existingCat.chips,
            ...newCategory.chips.filter(
              (nc) => !existingCat.chips.some((ec) => ec.label === nc.label)
            ),
          ],
        }
        return {
          ...prev,
          [currentStepId]: {
            ...sd,
            categories: sd.categories.map((c) =>
              c.categoryId === categoryId ? mergedCategory : c
            ),
          },
        }
      }

      // No prompt: full replacement
      return {
        ...prev,
        [currentStepId]: {
          ...sd,
          categories: sd.categories.map((c) => (c.categoryId === categoryId ? newCategory : c)),
        },
      }
    })
  }

  const handleAddCustomChip = (label: string, activeChipInputCategory: string | null) => {
    if (!activeChipInputCategory) return
    const newChip: Chip = { chipId: `custom_${Date.now()}`, label, isCustom: true }
    const catId = activeChipInputCategory

    updateStepDataMap((prev) => {
      const sd = prev[currentStepId]
      if (!sd) return prev
      return {
        ...prev,
        [currentStepId]: {
          ...sd,
          categories: sd.categories.map((c) =>
            c.categoryId === catId ? { ...c, chips: [...c.chips, newChip] } : c
          ),
          selections: sd.selections.map((sel) =>
            sel.categoryId === catId
              ? { ...sel, selectedChipIds: [...sel.selectedChipIds, newChip.chipId] }
              : sel
          ),
        },
      }
    })
  }

  const handleBack = (hasCompletedLaterSteps: boolean, setShowBackDialog: (v: boolean) => void) => {
    if (currentStepIndex === 0) return
    if (hasCompletedLaterSteps) {
      setShowBackDialog(true)
    } else {
      updateStepIndex((i) => i - 1)
    }
  }

  const handleBackReset = (setShowBackDialog: (v: boolean) => void) => {
    const prevIndex = currentStepIndex - 1
    updateStepDataMap((prev) => {
      const next = { ...prev }
      STEP_ORDER.slice(prevIndex + 1).forEach((id) => {
        delete next[id]
      })
      return next
    })
    updateStepIndex(() => prevIndex)
    setShowBackDialog(false)
  }

  const handleBackKeep = (setShowBackDialog: (v: boolean) => void) => {
    updateStepIndex((i) => i - 1)
    setShowBackDialog(false)
  }

  const pendingGoToRef = useRef<number | null>(null)

  const handleGoToStep = (targetIndex: number, setShowBackDialog: (v: boolean) => void) => {
    if (targetIndex === currentStepIndex) return

    // 앞으로 이동 (데이터 있는 스텝): 바로 이동
    if (targetIndex > currentStepIndex) {
      updateStepIndex(() => targetIndex)
      return
    }

    // 뒤로 가는 경우: 이후 스텝에 데이터가 있으면 다이얼로그
    const hasLater = STEP_ORDER.slice(targetIndex + 1).some(
      (id) => stepDataMapRef.current[id]?.loaded
    )
    if (hasLater) {
      pendingGoToRef.current = targetIndex
      setShowBackDialog(true)
    } else {
      updateStepIndex(() => targetIndex)
    }
  }

  const handleGoToReset = (setShowBackDialog: (v: boolean) => void) => {
    const targetIndex = pendingGoToRef.current ?? currentStepIndex - 1
    updateStepDataMap((prev) => {
      const next = { ...prev }
      STEP_ORDER.slice(targetIndex + 1).forEach((id) => {
        delete next[id]
      })
      return next
    })
    updateStepIndex(() => targetIndex)
    pendingGoToRef.current = null
    setShowBackDialog(false)
  }

  const handleGoToKeep = (setShowBackDialog: (v: boolean) => void) => {
    const targetIndex = pendingGoToRef.current ?? currentStepIndex - 1
    updateStepIndex(() => targetIndex)
    pendingGoToRef.current = null
    setShowBackDialog(false)
  }

  const handleNext = () => {
    if (currentStepIndex === STEP_ORDER.length - 1) {
      const completedSteps: BuildityStep[] = STEP_ORDER.map((stepId) => ({
        stepId,
        selections: stepDataMap[stepId]?.selections ?? [],
      }))
      onComplete(completedSteps, llmConfig)
    } else {
      updateStepIndex((i) => i + 1)
    }
  }

  const prevIndex = currentStepIndex - 1
  const hasCompletedLaterSteps =
    currentStepIndex > 0 && STEP_ORDER.slice(prevIndex + 1).some((id) => stepDataMap[id]?.loaded)

  const stepData = stepDataMap[currentStepId]
  const isCurrentStepLoading = loadingSteps.has(currentStepId)

  return {
    currentStepIndex,
    currentStepId,
    stepDataMap,
    stepData,
    isCurrentStepLoading,
    loadingSteps,
    chipPlan,
    retryInfo,
    hasCompletedLaterSteps,
    handleToggleChip,
    handleRefreshCategory,
    handleAddCustomChip,
    handleBack,
    handleBackReset,
    handleBackKeep,
    loadedSteps: new Set(STEP_ORDER.filter((id) => stepDataMap[id]?.loaded)),
    handleGoToStep,
    handleGoToReset,
    handleGoToKeep,
    handleNext,
  }
}
