"use client"

import type { LlmConfig } from "@carefree-studio/shared"
import { ModelSelector } from "./ModelSelector"

interface Props {
  currentIndex: number
  total: number
  stepLabel: string
  llmConfig: LlmConfig
  setModel: (provider: "anthropic" | "openai", model: string) => void
}

export function StepHeader({ currentIndex, total, stepLabel, llmConfig, setModel }: Props) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Step {currentIndex + 1} of {total}
        </p>
        <h2 className="font-display text-xl font-bold text-foreground">{stepLabel}</h2>
      </div>
      <ModelSelector llmConfig={llmConfig} setModel={setModel} />
    </div>
  )
}
