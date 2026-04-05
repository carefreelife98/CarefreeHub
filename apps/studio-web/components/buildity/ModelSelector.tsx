"use client"

import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon } from "lucide-react"
import type { LlmProvider, LlmConfig } from "@carefree-studio/shared"

const MODEL_OPTIONS: { provider: LlmProvider; model: string; label: string }[] = [
  { provider: "openai", model: "gpt-5.1", label: "GPT-5.1" },
  { provider: "openai", model: "gpt-5-mini", label: "GPT-5 mini" },
  { provider: "openai", model: "gpt-5-nano", label: "GPT-5 nano" },
  { provider: "openai", model: "gpt-4o", label: "GPT-4o" },
  { provider: "openai", model: "gpt-4o-mini", label: "GPT-4o mini" },
  { provider: "anthropic", model: "claude-opus-4-6", label: "Claude Opus 4.6" },
  { provider: "anthropic", model: "claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
  { provider: "anthropic", model: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5" },
]

const STORAGE_KEY = "buildity_model"
const DEFAULT_MODEL = "gpt-5.1"
const DEFAULT_PROVIDER: LlmProvider = "openai"

function getLabelForModel(model: string): string {
  return MODEL_OPTIONS.find((o) => o.model === model)?.label ?? model
}

export function useBuildityModel(initial?: LlmConfig): {
  llmConfig: LlmConfig
  setModel: (provider: LlmProvider, model: string) => void
} {
  const [llmConfig, setLlmConfig] = useState<LlmConfig>(
    initial ?? {
      provider: DEFAULT_PROVIDER,
      model: DEFAULT_MODEL,
    }
  )

  useEffect(() => {
    if (initial) {
      setLlmConfig(initial)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      } catch {}
      return
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as LlmConfig
        setLlmConfig(parsed)
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setModel = (provider: LlmProvider, model: string) => {
    const next: LlmConfig = { provider, model }
    setLlmConfig(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }

  return { llmConfig, setModel }
}

interface ModelSelectorProps {
  llmConfig: LlmConfig
  setModel: (provider: LlmProvider, model: string) => void
}

export function ModelSelector({ llmConfig, setModel }: ModelSelectorProps) {
  const anthropicOptions = MODEL_OPTIONS.filter((o) => o.provider === "anthropic")
  const openaiOptions = MODEL_OPTIONS.filter((o) => o.provider === "openai")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 h-8 text-xs font-medium cursor-pointer hover:bg-muted transition-colors">
        {getLabelForModel(llmConfig.model)}
        <ChevronDownIcon className="size-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Anthropic</DropdownMenuLabel>
          {anthropicOptions.map((o) => (
            <DropdownMenuItem key={o.model} onClick={() => setModel(o.provider, o.model)}>
              {o.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>OpenAI</DropdownMenuLabel>
          {openaiOptions.map((o) => (
            <DropdownMenuItem key={o.model} onClick={() => setModel(o.provider, o.model)}>
              {o.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
