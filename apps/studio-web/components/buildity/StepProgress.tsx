"use client"

import { CheckIcon } from "lucide-react"
import { STEP_ORDER, STEP_LABELS } from "./useStepData"

interface Props {
  currentIndex: number
  loadedSteps?: Set<string>
  onStepClick?: (index: number) => void
}

export function StepProgress({ currentIndex, loadedSteps, onStepClick }: Props) {
  return (
    <div className="flex items-start">
      {STEP_ORDER.map((stepId, index) => {
        const isCompleted = index < currentIndex
        const hasData = loadedSteps?.has(stepId) ?? false
        const isCurrent = index === currentIndex
        const isActive = isCurrent || isCompleted || hasData
        const isClickable = onStepClick && (isCompleted || hasData) && !isCurrent

        return (
          <div key={stepId} className="flex items-start flex-1 last:flex-none">
            {/* Node + label */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={`rounded-lg flex items-center justify-center font-bold transition-all duration-300 ${
                  isCurrent
                    ? "w-10 h-10 text-sm bg-primary text-primary-foreground shadow-md ring-4 ring-primary/20 animate-pulse"
                    : isCompleted || hasData
                      ? "w-8 h-8 text-xs bg-primary/10 text-primary hover:bg-primary/20"
                      : "w-8 h-8 text-xs bg-muted text-muted-foreground"
                } ${isClickable ? "" : "cursor-default"}`}
                aria-label={`${STEP_LABELS[stepId]} (스텝 ${index + 1})`}
              >
                {(isCompleted || hasData) && !isCurrent ? (
                  <CheckIcon className="size-4" />
                ) : (
                  index + 1
                )}
              </button>
              <span
                className={`text-[10px] font-medium text-center leading-tight transition-colors duration-300 ${
                  isCurrent
                    ? "text-primary"
                    : isActive
                      ? "text-foreground"
                      : "text-muted-foreground/60"
                }`}
              >
                {STEP_LABELS[stepId]}
              </span>
            </div>

            {/* Connector line */}
            {index < STEP_ORDER.length - 1 && (
              <div
                className={`h-px flex-1 mt-[18px] mx-1 ${isActive ? "bg-primary/30" : "bg-border"} transition-colors`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
