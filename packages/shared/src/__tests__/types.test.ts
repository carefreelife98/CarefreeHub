// packages/shared/src/__tests__/types.test.ts

import { describe, it, expect } from "vitest"
import {
  isProgressEvent,
  isCompleteEvent,
  isErrorEvent,
  isApiSuccess,
  type NodeEvent,
  type ApiResponse,
} from "../index.js"

describe("NodeEvent 타입 가드", () => {
  const progressEvent: NodeEvent = {
    type: "node:progress",
    graphId: "gentity",
    nodeId: "scout",
    timestamp: Date.now(),
    data: { message: "test", progress: 50 },
  }

  const completeEvent: NodeEvent = {
    type: "node:complete",
    graphId: "gentity",
    nodeId: "scout",
    timestamp: Date.now(),
    data: {
      message: "done",
      summary: { kind: "scout", competitorCount: 10, reviewCount: 500, platforms: ["google_play"] },
    },
  }

  const errorEvent: NodeEvent = {
    type: "node:error",
    graphId: "gentity",
    nodeId: "scout",
    timestamp: Date.now(),
    data: { message: "fail", code: "SCRAPE_FAILED" },
  }

  it("isProgressEvent는 progress 이벤트만 true", () => {
    expect(isProgressEvent(progressEvent)).toBe(true)
    expect(isProgressEvent(completeEvent)).toBe(false)
  })

  it("isCompleteEvent는 complete 이벤트만 true", () => {
    expect(isCompleteEvent(completeEvent)).toBe(true)
    expect(isCompleteEvent(progressEvent)).toBe(false)
  })

  it("isErrorEvent는 error 이벤트만 true", () => {
    expect(isErrorEvent(errorEvent)).toBe(true)
    expect(isErrorEvent(progressEvent)).toBe(false)
  })
})

describe("ApiResponse 타입 가드", () => {
  it("isApiSuccess는 success: true만 true", () => {
    const success: ApiResponse<string> = { success: true, data: "ok" }
    const error: ApiResponse<string> = {
      success: false,
      error: { code: "INTERNAL", message: "fail" },
    }

    expect(isApiSuccess(success)).toBe(true)
    expect(isApiSuccess(error)).toBe(false)
  })
})
