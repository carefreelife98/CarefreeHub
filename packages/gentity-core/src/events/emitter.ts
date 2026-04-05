// packages/gentity-core/src/events/emitter.ts

import type { NodeEventEmitter } from "@carefree-studio/shared"

export function createNoopEmitter(): NodeEventEmitter {
  return () => {}
}

export function createCollectingEmitter(): {
  emitter: NodeEventEmitter
  events: import("@carefree-studio/shared").NodeEvent[]
} {
  const events: import("@carefree-studio/shared").NodeEvent[] = []
  const emitter: NodeEventEmitter = (event) => {
    events.push(event)
  }
  return { emitter, events }
}
