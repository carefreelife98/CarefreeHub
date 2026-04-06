"use client"

import type { WebContainerStatus } from "./useWebContainer"

interface Props {
  url: string | null
  status: WebContainerStatus
  error: string | null
}

const STATUS_MESSAGES: Record<WebContainerStatus, string> = {
  idle: "게임 생성을 기다리는 중...",
  booting: "WebContainer 부팅 중...",
  installing: "패키지 설치 중 (npm install)...",
  running: "개발 서버 시작 중...",
  ready: "",
  error: "",
}

export function GamePreview({ url, status, error }: Props) {
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 max-w-md text-center">
          <p className="text-sm font-medium text-destructive mb-1">오류 발생</p>
          <p className="text-xs text-destructive/80">{error}</p>
        </div>
      </div>
    )
  }

  if (url) {
    return (
      <iframe
        src={url}
        className="h-full w-full rounded-xl border border-border"
        sandbox="allow-scripts allow-same-origin"
        title="게임 미리보기"
      />
    )
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        {status !== "idle" && (
          <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        )}
        <p className="text-sm text-muted-foreground">{STATUS_MESSAGES[status]}</p>
      </div>
    </div>
  )
}
