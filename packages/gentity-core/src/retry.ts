// packages/gentity-core/src/retry.ts

import { logger } from "./logger.js"

export interface RetryOptions {
  maxRetries?: number
  delayMs?: number
  label?: string
  onRetry?: (attempt: number, maxRetries: number, error: string) => void
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { maxRetries = 3, delayMs = 1000, label = "operation", onRetry } = options

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (attempt === maxRetries) {
        logger.error(`[retry] ${label} failed after ${maxRetries} attempts: ${message}`)
        throw error
      }
      logger.warn(
        `[retry] ${label} attempt ${attempt}/${maxRetries} failed: ${message}. Retrying in ${delayMs * attempt}ms...`
      )
      onRetry?.(attempt, maxRetries, message)
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt))
    }
  }

  throw new Error("Unreachable")
}
