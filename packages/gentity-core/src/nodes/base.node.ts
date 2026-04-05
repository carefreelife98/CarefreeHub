// packages/gentity-core/src/nodes/base.node.ts

import { logNodeStart, logNodeEnd, logNodeError } from "../logger.js"
import { withRetry } from "../retry.js"
import type {
  NodeEventEmitter,
  NodeEvent,
  NodeCompleteSummary,
  NodeProgressDetail,
  ErrorCode,
} from "@carefree-studio/shared"

export abstract class BaseNode<
  TInput,
  TOutput,
  TDetail extends NodeProgressDetail = NodeProgressDetail,
> {
  abstract readonly nodeId: string

  constructor(
    private readonly emitter: NodeEventEmitter,
    private readonly graphId: string
  ) {}

  protected abstract process(input: TInput): Promise<TOutput>
  protected abstract buildSummary(result: TOutput): NodeCompleteSummary

  async execute(input: TInput): Promise<TOutput> {
    this.emitStart(`${this.nodeId} 시작`)
    logNodeStart(this.nodeId, input)
    const startMs = Date.now()

    try {
      const result = await withRetry(() => this.process(input), {
        maxRetries: 3,
        label: `node:${this.nodeId}`,
      })
      const durationMs = Date.now() - startMs
      logNodeEnd(this.nodeId, durationMs, this.buildSummary(result))
      this.emitComplete(`${this.nodeId} 완료`, this.buildSummary(result))
      return result
    } catch (error) {
      const durationMs = Date.now() - startMs
      const message = error instanceof Error ? error.message : "Unknown error"
      logNodeError(this.nodeId, durationMs, error)
      this.emitError(message, "INTERNAL")
      throw error
    }
  }

  protected emitProgress(message: string, progress: number, detail?: TDetail): void {
    this.emitter({
      type: "node:progress",
      graphId: this.graphId,
      nodeId: this.nodeId,
      timestamp: Date.now(),
      data: { message, progress, detail },
    } satisfies NodeEvent)
  }

  private emitStart(message: string): void {
    this.emitter({
      type: "node:start",
      graphId: this.graphId,
      nodeId: this.nodeId,
      timestamp: Date.now(),
      data: { message },
    } satisfies NodeEvent)
  }

  private emitComplete(message: string, summary: NodeCompleteSummary): void {
    this.emitter({
      type: "node:complete",
      graphId: this.graphId,
      nodeId: this.nodeId,
      timestamp: Date.now(),
      data: { message, summary },
    } satisfies NodeEvent)
  }

  private emitError(message: string, code: ErrorCode): void {
    this.emitter({
      type: "node:error",
      graphId: this.graphId,
      nodeId: this.nodeId,
      timestamp: Date.now(),
      data: { message, code },
    } satisfies NodeEvent)
  }
}
