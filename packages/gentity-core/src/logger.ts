// packages/gentity-core/src/logger.ts

import { createLogger, format, transports } from "winston"

const { combine, timestamp, colorize, printf } = format

function truncate(value: unknown, maxLen = 300): string {
  const str = typeof value === "string" ? value : JSON.stringify(value)
  if (str == null) return "null"
  return str.length > maxLen ? str.slice(0, maxLen) + `...(${str.length} chars)` : str
}

function formatDuration(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`
}

const prettyFormat = printf(({ level, message, timestamp: ts, ...meta }) => {
  const metaStr =
    Object.keys(meta).length > 0
      ? ` | ${Object.entries(meta)
          .map(([k, v]) => `${k}=${truncate(v)}`)
          .join(" ")}`
      : ""
  return `${ts as string} [${level}] ${message as string}${metaStr}`
})

export const logger = createLogger({
  level: process.env.LOG_LEVEL ?? "debug",
  format: combine(timestamp({ format: "HH:mm:ss.SSS" }), colorize(), prettyFormat),
  transports: [new transports.Console()],
})

// ─── 편의 헬퍼 ──────────────────────────────────────────────────────────────

export function logNodeStart(nodeId: string, input: unknown): void {
  logger.info(`[node:${nodeId}] ▶ START`, { input: truncate(input, 500) })
}

export function logNodeEnd(nodeId: string, durationMs: number, output: unknown): void {
  logger.info(`[node:${nodeId}] ✔ END (${formatDuration(durationMs)})`, {
    output: truncate(output, 500),
  })
}

export function logNodeError(nodeId: string, durationMs: number, error: unknown): void {
  const msg = error instanceof Error ? error.message : String(error)
  logger.error(`[node:${nodeId}] ✘ FAIL (${formatDuration(durationMs)})`, { error: msg })
}

export function logHttp(method: string, path: string, body?: unknown): void {
  logger.info(`[http] → ${method} ${path}`, body ? { body: truncate(body, 400) } : {})
}

export function logHttpResponse(
  method: string,
  path: string,
  status: number,
  durationMs: number
): void {
  logger.info(`[http] ← ${method} ${path} ${status} (${formatDuration(durationMs)})`)
}
