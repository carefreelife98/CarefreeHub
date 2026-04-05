// packages/gentity-core/src/nodes/verify.node.ts

import { z } from "zod"
import { BaseNode } from "./base.node.js"
import { createLlmModel, type LlmModel } from "../llm/factory.js"
import { logger } from "../logger.js"
import type { NodeCompleteSummary, NodeEventEmitter, LlmConfig } from "@carefree-studio/shared"
import type { GameConcept, ReviewInsights, VerificationResult } from "@carefree-studio/shared"

const CriterionSchema = z.object({
  name: z.string(),
  passed: z.boolean(),
  evidence: z.string(),
})

const VerifySchema = z.object({
  criteria: z.array(CriterionSchema),
  overallPassed: z.boolean(),
  feedback: z.string(),
})

interface VerifyInput {
  concept: GameConcept
  insights: ReviewInsights
  retryCount: number
}

export class VerifyNode extends BaseNode<VerifyInput, VerificationResult> {
  readonly nodeId = "verify"

  private readonly model: LlmModel

  constructor(emitter: NodeEventEmitter, graphId: string, llmConfig: LlmConfig) {
    super(emitter, graphId)
    this.model = createLlmModel(llmConfig)
  }

  protected async process(input: VerifyInput): Promise<VerificationResult> {
    this.emitProgress("아이디어 품질을 점검하고 있어요", 50)

    const structured = this.model.withStructuredOutput(VerifySchema)
    const result = await structured.invoke([
      {
        role: "system",
        content: `You are a game concept reviewer. Verify that the game concept adequately addresses the user review insights.

Evaluate each of the following criteria individually and return per-criteria results:
1. "Pain Point Coverage" — Does the concept address at least 2 of the top pain points?
2. "Unmet Need Differentiator" — Does it leverage at least 1 unmet need as a differentiator?
3. "Monetization Alignment" — Is the monetization strategy aligned with user preferences?

For each criterion:
- name: the criterion name
- passed: true/false
- evidence: specific evidence from the concept supporting the judgment

Set overallPassed=true only if ALL criteria pass.
Provide feedback summarizing the overall assessment. Write feedback in Korean.`,
      },
      {
        role: "user",
        content: `## Game Concept
${JSON.stringify(input.concept, null, 2)}

## User Insights
### Pain Points
${input.insights.topPainPoints.map((p) => `- [★${p.score}] ${p.text}`).join("\n")}

### Unmet Needs
${input.insights.unmetNeeds.map((n) => `- [★${n.score}] ${n.text}`).join("\n")}`,
      },
    ])

    const verification: VerificationResult = {
      passed: result.overallPassed,
      criteria: result.criteria,
      feedback: result.feedback,
      retryCount: input.retryCount,
    }

    logger.info(`[node:verify] passed=${verification.passed} retryCount=${verification.retryCount}`)
    if (!verification.passed) {
      logger.warn(`[node:verify] feedback: ${verification.feedback}`)
      result.criteria
        .filter((c: z.infer<typeof CriterionSchema>) => !c.passed)
        .forEach((c: z.infer<typeof CriterionSchema>) =>
          logger.warn(`[node:verify] ❌ ${c.name}: ${c.evidence}`)
        )
    }

    return verification
  }

  protected buildSummary(result: VerificationResult): NodeCompleteSummary {
    return {
      kind: "verify",
      passed: result.passed,
      feedback: result.passed ? undefined : result.feedback,
    }
  }
}
