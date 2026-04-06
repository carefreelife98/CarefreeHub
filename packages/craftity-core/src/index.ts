// packages/craftity-core/src/index.ts

export { createNoopEmitter, createCollectingEmitter } from "./events/emitter.js"
export { createLlmModel } from "./llm/factory.js"
export { logger } from "./logger.js"
export { withRetry } from "./retry.js"
export { buildCraftityGraph } from "./graph.js"

import type {
  CraftityRequest,
  CraftityResult,
  GeneratedFile,
} from "@carefree-studio/shared"
import type { NodeEventEmitter } from "@carefree-studio/shared"
import { createNoopEmitter } from "./events/emitter.js"
import { buildCraftityGraph } from "./graph.js"
import type { AstValidateDeps } from "./nodes/ast-validate.node.js"

export interface CraftityDeps {
  validateFn: (files: GeneratedFile[]) => Promise<import("@carefree-studio/shared").ValidationError[]>
}

export async function craft(
  request: CraftityRequest,
  deps: CraftityDeps,
  emitter: NodeEventEmitter = createNoopEmitter(),
): Promise<CraftityResult> {
  const llmConfig = request.llm ?? { provider: "openai", model: "gpt-4.1" }
  const astValidateDeps: AstValidateDeps = { validateFn: deps.validateFn }

  const graph = buildCraftityGraph(emitter, astValidateDeps, llmConfig)

  const finalState = await graph.invoke({
    request,
    llmCallCount: 0,
    startTimeMs: Date.now(),
  })

  return finalState.result
}
