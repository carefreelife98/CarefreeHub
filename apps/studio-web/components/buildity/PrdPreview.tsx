"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Streamdown } from "streamdown"
import { code } from "@streamdown/code"
import { mermaid } from "@streamdown/mermaid"
import { cjk } from "@streamdown/cjk"
import { PrdProgressGraph } from "./PrdProgressGraph"
import { PrdSelectionSummary } from "./PrdSelectionSummary"
import "streamdown/styles.css"
import type { GameConcept, BuildityStep, LlmConfig } from "@carefree-studio/shared"
import { streamPrd as streamPrdApi } from "@/lib/api/buildity"

interface Props {
  concept: GameConcept
  steps: BuildityStep[]
  llmConfig?: LlmConfig
  onBack: () => void
}

export function PrdPreview({ concept, steps, llmConfig, onBack }: Props) {
  const [sections, setSections] = useState<string[]>(Array(7).fill(""))
  const [sectionTitles, setSectionTitles] = useState<string[]>([])
  const [sectionDone, setSectionDone] = useState<Set<number>>(new Set())
  const [isStreaming, setIsStreaming] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const markdown = sections.filter(Boolean).join("\n\n---\n\n")

  const streamPrd = async () => {
    setSections(Array(7).fill(""))
    setSectionTitles([])
    setSectionDone(new Set())
    setIsStreaming(true)
    setIsDone(false)
    setError(null)

    try {
      const res = await streamPrdApi({ concept, steps, llm: llmConfig })

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

          const eventType = eventLine?.slice(7).trim()
          if (eventType === "sections" && dataLine) {
            try {
              const { total, titles } = JSON.parse(dataLine.slice(6)) as {
                total: number
                titles: string[]
              }
              setSectionTitles(titles)
              setSections(Array(total).fill(""))
            } catch {}
          } else if (eventType === "section" && dataLine) {
            try {
              const { index, text } = JSON.parse(dataLine.slice(6)) as {
                index: number
                text: string
              }
              setSections((prev) => {
                const next = [...prev]
                next[index] = (next[index] ?? "") + text
                return next
              })
            } catch {}
          } else if (eventType === "section-done" && dataLine) {
            try {
              const { index } = JSON.parse(dataLine.slice(6)) as { index: number }
              setSectionDone((prev) => new Set(prev).add(index))
            } catch {}
          }
        }
      }
      setIsDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "PRD 생성 실패")
    } finally {
      setIsStreaming(false)
    }
  }

  useEffect(() => {
    void streamPrd()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown)
  }

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${concept.title}-PRD.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">PRD 생성</h2>
        <div className="flex gap-2">
          {isDone && (
            <>
              <button
                onClick={() => void handleCopy()}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
              >
                복사
              </button>
              <button
                onClick={handleDownload}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
              >
                MD 다운로드
              </button>
              <button
                onClick={() => void streamPrd()}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
              >
                재생성
              </button>
            </>
          )}
          <button
            onClick={onBack}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
          >
            스텝 수정하기
          </button>
        </div>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <PrdSelectionSummary steps={steps} />

      <PrdProgressGraph
        sectionTitles={sectionTitles}
        sections={sections}
        sectionDone={sectionDone}
        isStreaming={isStreaming}
      />

      <ScrollArea className="h-[60vh] rounded-xl border border-border bg-card p-6">
        {markdown ? (
          <Streamdown
            plugins={{ code, mermaid, cjk }}
            isAnimating={isStreaming}
            animated={{ animation: "fadeIn", duration: 200 }}
            caret={isStreaming ? "block" : undefined}
            mode={isStreaming ? "streaming" : "static"}
            controls={{
              code: { copy: true, download: true },
              table: { copy: true, download: true },
              mermaid: { download: true, copy: true },
            }}
          >
            {markdown}
          </Streamdown>
        ) : isStreaming ? (
          <div className="space-y-3">
            <div className="h-4 rounded-lg bg-muted animate-pulse" />
            <div className="h-4 rounded-lg bg-muted animate-pulse w-4/5" />
            <div className="h-4 rounded-lg bg-muted animate-pulse w-3/5" />
          </div>
        ) : null}
      </ScrollArea>
    </div>
  )
}
