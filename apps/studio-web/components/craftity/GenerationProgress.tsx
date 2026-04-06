"use client"

import type { CraftityEvent } from "@carefree-studio/shared"

type NodeStatus = "pending" | "running" | "done" | "error"

interface NodeState {
  status: NodeStatus
  message: string
}

interface Props {
  events: CraftityEvent[]
  latestMessage: string
  error: string | null
}

const NODE_LABELS: Record<string, string> = {
  "parse-prd": "PRD 파싱",
  "design-structure": "구조 설계",
  "setup-assets": "에셋 설정",
  "generate-files": "코드 생성",
  "ast-validate": "컴파일 검증",
  finalize: "최종화",
}

const NODE_ORDER = [
  "parse-prd",
  "design-structure",
  "setup-assets",
  "generate-files",
  "ast-validate",
  "finalize",
]

function StatusIcon({ status }: { status: NodeStatus }) {
  if (status === "done") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-500 text-xs">
        ✓
      </span>
    )
  }
  if (status === "running") {
    return (
      <span className="flex h-5 w-5 items-center justify-center">
        <span className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </span>
    )
  }
  if (status === "error") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive/20 text-destructive text-xs">
        ✗
      </span>
    )
  }
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
    </span>
  )
}

function deriveNodeStates(events: CraftityEvent[]): Record<string, NodeState> {
  const states: Record<string, NodeState> = {}

  for (const event of events) {
    if (event.type === "status") {
      const phase = event.phase
      if (!states[phase]) {
        states[phase] = { status: "running", message: event.message }
      } else {
        states[phase] = { status: "running", message: event.message }
      }
    } else if (event.type === "design") {
      if (states["design-structure"]) {
        states["design-structure"] = { ...states["design-structure"], status: "done" }
      } else {
        states["design-structure"] = { status: "done", message: "구조 설계 완료" }
      }
    } else if (event.type === "assets") {
      if (states["setup-assets"]) {
        states["setup-assets"] = { ...states["setup-assets"], status: "done" }
      } else {
        states["setup-assets"] = { status: "done", message: "에셋 설정 완료" }
      }
    } else if (event.type === "file-done") {
      if (!states["generate-files"]) {
        states["generate-files"] = { status: "running", message: `파일 생성 중: ${event.path}` }
      } else {
        states["generate-files"] = {
          ...states["generate-files"],
          message: `파일 생성 중: ${event.path}`,
        }
      }
    } else if (event.type === "validate") {
      if (event.status === "pass") {
        states["ast-validate"] = { status: "done", message: "컴파일 검증 통과" }
      } else if (event.status === "error") {
        states["ast-validate"] = {
          status: event.retrying ? "running" : "error",
          message: `검증 오류 ${event.errors?.length ?? 0}건`,
        }
      } else {
        states["ast-validate"] = { status: "running", message: "컴파일 검증 중..." }
      }
    } else if (event.type === "finalize") {
      states["finalize"] = {
        status: "done",
        message: `최종화 완료 (파일 ${event.totalFiles}개)`,
      }
    }
  }

  return states
}

export function GenerationProgress({ events, latestMessage, error }: Props) {
  const nodeStates = deriveNodeStates(events)

  const nodes = NODE_ORDER.map((id) => ({
    id,
    label: NODE_LABELS[id] ?? id,
    state: nodeStates[id] ?? { status: "pending" as NodeStatus, message: "" },
  }))

  return (
    <div className="flex flex-col gap-4 p-4">
      <h3 className="font-medium text-sm">생성 진행 상황</h3>

      <div className="flex flex-col gap-3">
        {nodes.map((node) => (
          <div key={node.id} className="flex items-center gap-3">
            <StatusIcon status={node.state.status} />
            <div className="flex flex-col min-w-0">
              <span
                className={
                  node.state.status === "pending"
                    ? "text-sm text-muted-foreground"
                    : node.state.status === "error"
                      ? "text-sm text-destructive"
                      : "text-sm font-medium"
                }
              >
                {node.label}
              </span>
              {node.state.status !== "pending" && node.state.message && (
                <span className="text-xs text-muted-foreground truncate">{node.state.message}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {latestMessage && (
        <div className="rounded-lg bg-muted px-3 py-2">
          <p className="text-xs text-muted-foreground">{latestMessage}</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-destructive/10 px-3 py-2">
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}
    </div>
  )
}
