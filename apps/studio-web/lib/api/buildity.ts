// apps/web/lib/api/buildity.ts

import type {
  ChipGenerateRequest,
  ChipRefreshRequest,
  PrdBuildRequest,
  ChipCategory,
} from "@carefree-studio/shared"

export async function streamChips(
  request: ChipGenerateRequest,
  signal?: AbortSignal
): Promise<Response> {
  const res = await fetch("/api/buildity/chips/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  })
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)
  return res
}

export async function refreshChips(request: ChipRefreshRequest): Promise<ChipCategory> {
  const res = await fetch("/api/buildity/chips/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = (await res.json()) as { success: boolean; data: ChipCategory }
  if (!json.success) throw new Error("Chip refresh failed")
  return json.data
}

export async function streamPrd(request: PrdBuildRequest, signal?: AbortSignal): Promise<Response> {
  const res = await fetch("/api/buildity/build/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  })
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)
  return res
}
