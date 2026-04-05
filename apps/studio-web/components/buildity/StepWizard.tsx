"use client"

import { useState } from "react"
import type { BuildityStep, GameConcept, LlmConfig } from "@carefree-studio/shared"
import { ChipInput } from "./ChipInput"
import { StepBackDialog } from "./StepBackDialog"
import { useBuildityModel } from "./ModelSelector"
import { useStepData, STEP_ORDER, STEP_LABELS } from "./useStepData"
import { StepProgress } from "./StepProgress"
import { StepHeader } from "./StepHeader"
import { StepNavigation } from "./StepNavigation"
import { StepContent } from "./StepContent"

interface Props {
  concept: GameConcept
  analysisId?: string
  initialLlmConfig?: LlmConfig
  onComplete: (steps: BuildityStep[], llmConfig: LlmConfig) => void
}

export function StepWizard({ concept, analysisId, initialLlmConfig, onComplete }: Props) {
  const { llmConfig, setModel } = useBuildityModel(initialLlmConfig)

  const [showBackDialog, setShowBackDialog] = useState(false)
  const [chipInputOpen, setChipInputOpen] = useState(false)
  const [activeChipInputCategory, setActiveChipInputCategory] = useState<string | null>(null)

  const {
    currentStepIndex,
    currentStepId,
    stepData,
    isCurrentStepLoading,
    chipPlan,
    retryInfo,
    hasCompletedLaterSteps,
    handleToggleChip,
    handleRefreshCategory,
    handleAddCustomChip,
    handleBack,
    handleBackReset,
    handleBackKeep,
    loadedSteps,
    handleGoToStep,
    handleGoToReset,
    handleGoToKeep,
    handleNext,
  } = useStepData({ concept, analysisId, llmConfig, onComplete })

  const [dialogMode, setDialogMode] = useState<"back" | "goto">("back")

  const onBack = () => handleBack(hasCompletedLaterSteps, setShowBackDialog)
  const onBackReset = () => {
    if (dialogMode === "goto") handleGoToReset(setShowBackDialog)
    else handleBackReset(setShowBackDialog)
  }
  const onBackKeep = () => {
    if (dialogMode === "goto") handleGoToKeep(setShowBackDialog)
    else handleBackKeep(setShowBackDialog)
  }

  const onStepClick = (index: number) => {
    if (index === currentStepIndex) return
    setDialogMode("goto")
    handleGoToStep(index, setShowBackDialog)
  }
  const onAddCustomChip = (label: string) => handleAddCustomChip(label, activeChipInputCategory)

  return (
    <div className="space-y-8">
      <StepProgress
        currentIndex={currentStepIndex}
        loadedSteps={loadedSteps}
        onStepClick={onStepClick}
      />

      <StepHeader
        currentIndex={currentStepIndex}
        total={STEP_ORDER.length}
        stepLabel={STEP_LABELS[currentStepId]}
        llmConfig={llmConfig}
        setModel={setModel}
      />

      <StepContent
        stepData={stepData}
        isLoading={isCurrentStepLoading}
        chipPlan={chipPlan}
        retryInfo={retryInfo}
        onToggleChip={handleToggleChip}
        onRefreshCategory={handleRefreshCategory}
        onOpenChipInput={(categoryId) => {
          setActiveChipInputCategory(categoryId)
          setChipInputOpen(true)
        }}
      />

      <StepNavigation
        onBack={onBack}
        onNext={handleNext}
        isFirstStep={currentStepIndex === 0}
        isLastStep={currentStepIndex === STEP_ORDER.length - 1}
        isLoading={isCurrentStepLoading}
      />

      <StepBackDialog
        open={showBackDialog}
        onOpenChange={setShowBackDialog}
        onReset={onBackReset}
        onKeep={onBackKeep}
      />

      <ChipInput open={chipInputOpen} onOpenChange={setChipInputOpen} onAdd={onAddCustomChip} />
    </div>
  )
}
