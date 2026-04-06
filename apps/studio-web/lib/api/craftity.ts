import { getApiUrl } from "@/lib/api-url"
import type { CraftityRequest, CraftityEvent, GeneratedFile } from "@carefree-studio/shared"

const api = () => getApiUrl()

export async function startCraft(request: CraftityRequest): Promise<{ streamId: string }> {
  const res = await fetch(`${api()}/api/craftity/craft`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = (await res.json()) as { streamId: string }
  return json
}

interface CraftStreamCallbacks {
  onEvent?: (event: CraftityEvent) => void
  onDone?: (gameId: string, versionId: string) => void
  onError?: (message: string) => void
}

export function subscribeToCraftStream(
  streamId: string,
  callbacks: CraftStreamCallbacks
): () => void {
  const es = new EventSource(`${api()}/api/craftity/craft/${streamId}/events`)

  es.onmessage = (e) => {
    try {
      const event = JSON.parse(e.data as string) as CraftityEvent
      callbacks.onEvent?.(event)
    } catch {
      // ignore parse errors
    }
  }

  es.addEventListener("done", (e) => {
    try {
      const data = JSON.parse((e as MessageEvent).data as string) as {
        gameId: string
        versionId: string
      }
      callbacks.onDone?.(data.gameId, data.versionId)
    } catch {
      callbacks.onDone?.("", "")
    }
    es.close()
  })

  es.addEventListener("server-error", (e) => {
    try {
      const data = JSON.parse((e as MessageEvent).data as string) as { message: string }
      callbacks.onError?.(data.message)
    } catch {
      callbacks.onError?.("Unknown server error")
    }
    es.close()
  })

  es.onerror = () => {
    callbacks.onError?.("SSE connection error")
    es.close()
  }

  return () => es.close()
}

export async function getGameFiles(gameId: string): Promise<GeneratedFile[]> {
  const res = await fetch(`${api()}/api/craftity/game/${gameId}/files`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = (await res.json()) as { files: GeneratedFile[] }
  return json.files
}
