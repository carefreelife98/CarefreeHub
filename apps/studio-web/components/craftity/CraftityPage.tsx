"use client"

import { useEffect, useRef, useState } from "react"
import type { CraftityEvent } from "@carefree-studio/shared"
import { startCraft, subscribeToCraftStream, getGameFiles } from "@/lib/api/craftity"
import { useWebContainer } from "./useWebContainer"
import { GamePreview } from "./GamePreview"
import { GenerationProgress } from "./GenerationProgress"

export function CraftityPage() {
  const [events, setEvents] = useState<CraftityEvent[]>([])
  const [latestMessage, setLatestMessage] = useState("")
  const [craftError, setCraftError] = useState<string | null>(null)
  const { state: wcState, mountAndRun, teardown } = useWebContainer()
  const cleanupRef = useRef<(() => void) | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const prdMarkdown = sessionStorage.getItem("craftity-prd") ?? ""
    const llmProvider = sessionStorage.getItem("craftity-llm") ?? "openai"

    const run = async () => {
      try {
        const { streamId } = await startCraft({
          prdMarkdown,
          llm: { provider: llmProvider as "openai" | "anthropic", model: "" },
        })

        const cleanup = subscribeToCraftStream(streamId, {
          onEvent: (event) => {
            setEvents((prev) => [...prev, event])
            if (event.type === "status") {
              setLatestMessage(event.message)
            }
          },
          onDone: async (gameId) => {
            setLatestMessage("파일 로드 중...")
            try {
              const files = await getGameFiles(gameId)
              await mountAndRun(files)
            } catch (err) {
              setCraftError(err instanceof Error ? err.message : "파일 로드 실패")
            }
          },
          onError: (message) => {
            setCraftError(message)
          },
        })

        cleanupRef.current = cleanup
      } catch (err) {
        setCraftError(err instanceof Error ? err.message : "게임 생성 시작 실패")
      }
    }

    void run()

    return () => {
      cleanupRef.current?.()
      teardown()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const displayError = craftError ?? wcState.error

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 p-4">
        <GamePreview url={wcState.url} status={wcState.status} error={wcState.error} />
      </div>
      <div className="w-[400px] border-l overflow-y-auto">
        <GenerationProgress
          events={events}
          latestMessage={latestMessage}
          error={displayError}
        />
      </div>
    </div>
  )
}
