// packages/shared/src/types/events.ts

export type NodeEventType = "node:start" | "node:progress" | "node:complete" | "node:error"

export interface NodeStartEvent {
  type: "node:start"
  graphId: string
  nodeId: string
  timestamp: number
  data: {
    message: string
  }
}

export interface NodeProgressEvent {
  type: "node:progress"
  graphId: string
  nodeId: string
  timestamp: number
  data: {
    message: string
    progress: number
    detail?: NodeProgressDetail
  }
}

export interface NodeCompleteEvent {
  type: "node:complete"
  graphId: string
  nodeId: string
  timestamp: number
  data: {
    message: string
    summary: NodeCompleteSummary
  }
}

export interface NodeErrorEvent {
  type: "node:error"
  graphId: string
  nodeId: string
  timestamp: number
  data: {
    message: string
    code: ErrorCode
  }
}

export type NodeEvent = NodeStartEvent | NodeProgressEvent | NodeCompleteEvent | NodeErrorEvent

export type NodeProgressDetail =
  | { kind: "scraping"; appTitle: string; current: number; total: number }
  | { kind: "analyzing"; reviewCount: number }
  | { kind: "generating" }

export type NodeCompleteSummary =
  | { kind: "scout"; competitorCount: number; reviewCount: number; platforms: Platform[] }
  | { kind: "validate-search"; passed: boolean; relevantCount: number; feedback?: string }
  | { kind: "analyze"; strengthCount: number; painPointCount: number }
  | { kind: "create"; conceptTitle: string }
  | { kind: "verify"; passed: boolean; feedback?: string }

export type ErrorCode =
  | "SCRAPE_FAILED"
  | "LLM_TIMEOUT"
  | "LLM_RATE_LIMIT"
  | "VALIDATION_FAILED"
  | "INTERNAL"

export type Platform = "google_play" | "app_store"

export type NodeEventEmitter = (event: NodeEvent) => void

export function isProgressEvent(event: NodeEvent): event is NodeProgressEvent {
  return event.type === "node:progress"
}

export function isCompleteEvent(event: NodeEvent): event is NodeCompleteEvent {
  return event.type === "node:complete"
}

export function isErrorEvent(event: NodeEvent): event is NodeErrorEvent {
  return event.type === "node:error"
}
