// packages/gentity-core/src/__tests__/base.node.test.ts

import { describe, it, expect } from "vitest"
import { BaseNode } from "../nodes/base.node.js"
import { createCollectingEmitter } from "../events/emitter.js"
import type { NodeCompleteSummary } from "@carefree-studio/shared"

class TestNode extends BaseNode<string, number> {
  readonly nodeId = "test"

  protected async process(input: string): Promise<number> {
    this.emitProgress("처리 중", 50)
    return input.length
  }

  protected buildSummary(result: number): NodeCompleteSummary {
    return { kind: "create", conceptTitle: `length-${result}` }
  }
}

class FailingNode extends BaseNode<string, number> {
  readonly nodeId = "failing"

  protected async process(): Promise<number> {
    throw new Error("test error")
  }

  protected buildSummary(): NodeCompleteSummary {
    return { kind: "create", conceptTitle: "" }
  }
}

describe("BaseNode", () => {
  it("execute()는 start → progress → complete 이벤트를 순서대로 발행한다", async () => {
    const { emitter, events } = createCollectingEmitter()
    const node = new TestNode(emitter, "gentity")

    const result = await node.execute("hello")

    expect(result).toBe(5)
    expect(events).toHaveLength(3)
    expect(events[0].type).toBe("node:start")
    expect(events[0].graphId).toBe("gentity")
    expect(events[0].nodeId).toBe("test")
    expect(events[1].type).toBe("node:progress")
    expect(events[2].type).toBe("node:complete")
  })

  it("process()에서 에러 발생 시 error 이벤트를 발행하고 throw한다", async () => {
    const { emitter, events } = createCollectingEmitter()
    const node = new FailingNode(emitter, "gentity")

    await expect(node.execute("hello")).rejects.toThrow("test error")

    expect(events).toHaveLength(2)
    expect(events[0].type).toBe("node:start")
    expect(events[1].type).toBe("node:error")
    if (events[1].type === "node:error") {
      expect(events[1].data.code).toBe("INTERNAL")
    }
  })
})
