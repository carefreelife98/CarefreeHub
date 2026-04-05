"use client"

import { useEffect, useReducer, useState, useRef } from "react"
import { CheckCircle2Icon, LoaderIcon, CircleIcon, ClockIcon } from "lucide-react"

type NodeId = "parse" | "scout" | "validate-search" | "analyze" | "create" | "verify" | "format"
type NodeStatus = "waiting" | "running" | "done" | "error"

type NodeEvent =
  | { type: "node:start"; nodeId: string; data: { message: string } }
  | { type: "node:progress"; nodeId: string; data: { message: string; progress: number } }
  | {
      type: "node:complete"
      nodeId: string
      data: { message: string; summary?: Record<string, unknown> }
    }
  | { type: "node:error"; nodeId: string; data: { message: string } }

interface NodeState {
  status: NodeStatus
  message: string
  progress: number
  startedAt: number | null
  completedAt: number | null
  summary: Record<string, unknown> | null
}

const NODE_ORDER: NodeId[] = [
  "parse",
  "scout",
  "validate-search",
  "analyze",
  "create",
  "verify",
  "format",
]

const NODE_LABELS: Record<NodeId, string> = {
  parse: "키워드",
  scout: "경쟁작",
  "validate-search": "검증",
  analyze: "리뷰",
  create: "컨셉",
  verify: "점검",
  format: "리포트",
}

const NODE_WEIGHTS: Record<NodeId, number> = {
  parse: 5,
  scout: 25,
  "validate-search": 5,
  analyze: 15,
  create: 20,
  verify: 15,
  format: 15,
}

const NODE_FRIENDLY: Record<NodeId, { running: string; done: string }> = {
  parse: { running: "게임 키워드를 분석하고 있어요", done: "키워드 분석 완료" },
  scout: { running: "시장에서 경쟁작을 찾고 있어요", done: "경쟁작 수집 완료" },
  "validate-search": {
    running: "경쟁작이 적절한지 확인하고 있어요",
    done: "검색 관련성 확인 완료",
  },
  analyze: { running: "유저 리뷰를 읽고 있어요", done: "리뷰 분석 완료" },
  create: { running: "게임 아이디어를 구상하고 있어요", done: "게임 컨셉 생성 완료" },
  verify: { running: "아이디어 품질을 점검하고 있어요", done: "품질 검증 통과" },
  format: { running: "리포트를 작성하고 있어요", done: "리포트 작성 완료" },
}

// 각 노드에서 순환할 서브 메시지들
const NODE_ROTATING_MSGS: Record<NodeId, string[]> = {
  parse: [
    "입력한 키워드에서 핵심 장르를 추출하고 있어요",
    "영어·한국어 검색 키워드를 생성하고 있어요",
  ],
  scout: [
    "Google Play에서 인기 게임을 검색하고 있어요",
    "App Store에서 관련 게임을 찾고 있어요",
    "찾은 게임들의 리뷰를 수집하고 있어요",
  ],
  "validate-search": ["검색 결과가 의도에 맞는지 AI가 판단하고 있어요"],
  analyze: [
    "긍정 리뷰에서 강점을 찾고 있어요",
    "부정 리뷰에서 페인포인트를 분석하고 있어요",
    "충족되지 않은 니즈를 발굴하고 있어요",
    "트렌드 패턴을 식별하고 있어요",
  ],
  create: [
    "시장 데이터를 종합하고 있어요",
    "독창적인 게임 메커니즘을 설계하고 있어요",
    "타겟 유저와 수익화 전략을 구상하고 있어요",
    "컨셉 문서를 정리하고 있어요",
  ],
  verify: [
    "컨셉이 유저 페인포인트를 해결하는지 확인하고 있어요",
    "수익화 전략이 시장에 적합한지 검증하고 있어요",
    "차별화 포인트를 점검하고 있어요",
  ],
  format: ["분석 결과를 정리하고 있어요", "리포트를 작성하고 있어요"],
}

const SLOW_HINTS: Record<string, string> = {
  parse: "",
  scout: "스토어에서 앱 정보와 리뷰를 수집하고 있어요. 잠시만 기다려주세요!",
  "validate-search": "",
  analyze: "AI가 수백 건의 리뷰를 꼼꼼히 분류하고 있어요. 조금만 기다려주세요!",
  "create-1":
    "AI가 시장 데이터를 종합하여 독창적인 컨셉을 설계하고 있어요. 열심히 설계 중이니 잠시만 기다려 주세요!",
  "create-2": "컨셉을 보기 좋은 문서로 정리하고 있어요. 거의 다 됐어요!",
  verify: "AI가 컨셉의 시장성과 차별화를 검증하고 있어요. 조금만 기다려주세요!",
  format: "",
}

function createInitialState(): Record<NodeId, NodeState> {
  return Object.fromEntries(
    NODE_ORDER.map((id) => [
      id,
      {
        status: "waiting" as const,
        message: "",
        progress: 0,
        startedAt: null,
        completedAt: null,
        summary: null,
      },
    ])
  ) as Record<NodeId, NodeState>
}

type Action =
  | { type: "start"; nodeId: NodeId }
  | { type: "progress"; nodeId: NodeId; message: string; progress: number }
  | { type: "complete"; nodeId: NodeId; message: string; summary?: Record<string, unknown> }
  | { type: "error"; nodeId: NodeId; message: string }

function reducer(state: Record<NodeId, NodeState>, action: Action): Record<NodeId, NodeState> {
  const node = state[action.nodeId]
  if (!node) return state
  switch (action.type) {
    case "start":
      return {
        ...state,
        [action.nodeId]: { ...node, status: "running", startedAt: Date.now(), progress: 0 },
      }
    case "progress":
      return {
        ...state,
        [action.nodeId]: { ...node, message: action.message, progress: action.progress },
      }
    case "complete":
      return {
        ...state,
        [action.nodeId]: {
          ...node,
          status: "done",
          message: action.message,
          progress: 100,
          completedAt: Date.now(),
          summary: action.summary ?? null,
        },
      }
    case "error":
      return {
        ...state,
        [action.nodeId]: {
          ...node,
          status: "error",
          message: action.message,
          completedAt: Date.now(),
        },
      }
    default:
      return state
  }
}

function computeOverallProgress(states: Record<NodeId, NodeState>): number {
  let total = 0
  for (const nodeId of NODE_ORDER) {
    const w = NODE_WEIGHTS[nodeId]
    const s = states[nodeId]
    if (s.status === "done") total += w
    else if (s.status === "running") total += (w * s.progress) / 100
  }
  return Math.min(100, Math.round(total))
}

interface Props {
  analysisId: string
  onComplete: () => void
}

function ElapsedTime({
  startedAt,
  stoppedAt,
}: {
  startedAt: number | null
  stoppedAt?: number | null
}) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (!startedAt) return
    if (stoppedAt) {
      setElapsed(Math.round((stoppedAt - startedAt) / 1000))
      return
    }
    const interval = setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt) / 1000)),
      1000
    )
    return () => clearInterval(interval)
  }, [startedAt, stoppedAt])
  if (!startedAt) return null
  return <span className="text-xs text-muted-foreground font-mono">{elapsed}초</span>
}

function RotatingMessage({ nodeId }: { nodeId: NodeId }) {
  const messages = NODE_ROTATING_MSGS[nodeId]
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!messages || messages.length <= 1) return
    let timeoutId: ReturnType<typeof setTimeout>
    const interval = setInterval(() => {
      setVisible(false)
      timeoutId = setTimeout(() => {
        setIndex((i) => (i + 1) % messages.length)
        setVisible(true)
      }, 400)
    }, 4000)
    return () => {
      clearInterval(interval)
      clearTimeout(timeoutId)
    }
  }, [messages])

  if (!messages || messages.length === 0) return null

  return (
    <p
      className="text-sm text-muted-foreground transition-all duration-400"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-4px)",
        filter: visible ? "blur(0)" : "blur(3px)",
      }}
    >
      {messages[index]}
    </p>
  )
}

function SlowHint({
  nodeId,
  message,
  startedAt,
}: {
  nodeId: NodeId
  message: string
  startedAt: number | null
}) {
  const [show, setShow] = useState(false)

  // create 노드는 메시지로 단계 구분
  const hintKey =
    nodeId === "create" && message.includes("문서")
      ? "create-2"
      : nodeId === "create"
        ? "create-1"
        : nodeId
  const hint = SLOW_HINTS[hintKey] ?? ""

  useEffect(() => {
    setShow(false)
    if (!startedAt || !hint) return
    const timer = setTimeout(() => setShow(true), 5000)
    return () => clearTimeout(timer)
  }, [startedAt, hint])

  if (!show || !hint) return null
  return (
    <p className="text-xs text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-700">
      💡 {hint}
    </p>
  )
}

function getDoneSummary(nodeId: NodeId, summary: Record<string, unknown> | null): string {
  if (!summary) return NODE_FRIENDLY[nodeId].done

  switch (nodeId) {
    case "parse": {
      const title = summary.conceptTitle as string | undefined
      return title ? `키워드 추출 완료 — ${title}` : NODE_FRIENDLY[nodeId].done
    }
    case "scout": {
      const cc = summary.competitorCount as number | undefined
      const rc = summary.reviewCount as number | undefined
      if (cc != null && rc != null)
        return `경쟁작 ${cc}개 · 리뷰 ${rc.toLocaleString()}건 수집 완료`
      if (cc != null) return `경쟁작 ${cc}개 수집 완료`
      return NODE_FRIENDLY[nodeId].done
    }
    case "validate-search": {
      const count = summary.relevantCount as number | undefined
      return count != null ? `관련 경쟁작 ${count}개 확인 완료` : NODE_FRIENDLY[nodeId].done
    }
    case "analyze": {
      const s = summary.strengthCount as number | undefined
      const p = summary.painPointCount as number | undefined
      if (s != null && p != null) return `강점 ${s}건 · 페인포인트 ${p}건 분석 완료`
      return NODE_FRIENDLY[nodeId].done
    }
    case "create": {
      const title = summary.conceptTitle as string | undefined
      return title ? `"${title}" 컨셉 생성 완료` : NODE_FRIENDLY[nodeId].done
    }
    case "verify": {
      const passed = summary.passed as boolean | undefined
      if (passed === true) return "품질 검증 통과 ✓"
      if (passed === false) return "품질 검증 완료 (재시도 포함)"
      return NODE_FRIENDLY[nodeId].done
    }
    default:
      return NODE_FRIENDLY[nodeId].done
  }
}

export function AnalysisProgress({ analysisId, onComplete }: Props) {
  const [nodeStates, dispatch] = useReducer(reducer, undefined, createInitialState)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    let errorCount = 0
    const es = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/api/gentity/analyze/${analysisId}/events`)

    es.onmessage = (e) => {
      errorCount = 0
      try {
        const event = JSON.parse(e.data) as NodeEvent
        const nodeId = event.nodeId as NodeId
        if (!NODE_ORDER.includes(nodeId)) return
        switch (event.type) {
          case "node:start":
            dispatch({ type: "start", nodeId })
            break
          case "node:progress":
            dispatch({
              type: "progress",
              nodeId,
              message: event.data.message,
              progress: event.data.progress,
            })
            break
          case "node:complete":
            dispatch({
              type: "complete",
              nodeId,
              message: event.data.message,
              summary: event.data.summary,
            })
            break
          case "node:error":
            dispatch({ type: "error", nodeId, message: event.data.message })
            break
        }
      } catch {}
    }

    es.addEventListener("ping", () => {
      errorCount = 0
    })
    es.addEventListener("server-error", () => {
      errorCount = 0
      // server-error 직후 done 이벤트가 오므로 정상 완료 처리됨
      // DB 저장 실패 등 — 분석 결과 자체는 정상이므로 사용자에게 에러 미표시
    })
    es.addEventListener("done", () => {
      es.close()
      onCompleteRef.current()
    })
    es.addEventListener("error", () => {
      errorCount++
      if (errorCount >= 5) es.close()
    })

    return () => es.close()
  }, [analysisId])

  const overallProgress = computeOverallProgress(nodeStates)
  const currentNode = NODE_ORDER.find((id) => nodeStates[id].status === "running")
  const completedNodes = NODE_ORDER.filter((id) => nodeStates[id].status === "done")

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">전체 분석 진행률</span>
          <span className="text-sm font-mono text-primary font-bold">{overallProgress}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      <div className="flex items-start">
        {NODE_ORDER.map((nodeId, index) => {
          const state = nodeStates[nodeId]
          const isDone = state.status === "done"
          const isRunning = state.status === "running"
          return (
            <div key={nodeId} className="flex items-start flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex items-center justify-center rounded-lg transition-all duration-300 ${
                    isRunning
                      ? "w-9 h-9 bg-primary text-primary-foreground shadow-md ring-4 ring-primary/20 animate-pulse"
                      : isDone
                        ? "w-7 h-7 bg-primary/10 text-primary"
                        : "w-7 h-7 bg-muted text-muted-foreground/40"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2Icon className="size-3.5" />
                  ) : isRunning ? (
                    <LoaderIcon className="size-4 animate-spin" />
                  ) : (
                    <CircleIcon className="size-3" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium text-center transition-colors ${isRunning ? "text-primary" : isDone ? "text-foreground" : "text-muted-foreground/40"}`}
                >
                  {NODE_LABELS[nodeId]}
                </span>
              </div>
              {index < NODE_ORDER.length - 1 && (
                <div
                  className={`h-px flex-1 mt-[14px] mx-0.5 ${isDone ? "bg-primary/30" : "bg-border"} transition-colors`}
                />
              )}
            </div>
          )
        })}
      </div>

      {currentNode && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <p
              key={nodeStates[currentNode].message || currentNode}
              className="font-display font-bold text-lg text-foreground animate-in fade-in slide-in-from-left-2 duration-500"
            >
              {nodeStates[currentNode].message || NODE_FRIENDLY[currentNode].running}
            </p>
            <ElapsedTime startedAt={nodeStates[currentNode].startedAt} />
          </div>
          {nodeStates[currentNode].progress > 0 && nodeStates[currentNode].progress < 100 && (
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${nodeStates[currentNode].progress}%` }}
              />
            </div>
          )}
          <RotatingMessage nodeId={currentNode} />
          <SlowHint
            nodeId={currentNode}
            message={nodeStates[currentNode].message}
            startedAt={nodeStates[currentNode].startedAt}
          />
        </div>
      )}

      {!currentNode && completedNodes.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <LoaderIcon className="size-6 text-primary animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">분석을 준비하고 있어요...</p>
        </div>
      )}

      {completedNodes.length > 0 && (
        <div className="space-y-2">
          {completedNodes.map((nodeId) => {
            const state = nodeStates[nodeId]
            const duration =
              state.startedAt && state.completedAt
                ? Math.round((state.completedAt - state.startedAt) / 1000)
                : 0
            return (
              <div
                key={nodeId}
                className="flex items-center gap-3 text-sm animate-in fade-in slide-in-from-left-3 duration-500"
              >
                <CheckCircle2Icon className="size-4 text-primary flex-shrink-0" />
                <span className="text-foreground">{getDoneSummary(nodeId, state.summary)}</span>
                <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                  <ClockIcon className="size-3" />
                  {duration}초
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
