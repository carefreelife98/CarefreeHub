// packages/craftity-core/src/nodes/parse-prd.node.ts

import { z } from "zod"
import { BaseNode } from "./base.node.js"
import { createLlmModel, type LlmModel } from "../llm/factory.js"
import { PARSE_PRD_PROMPT } from "../prompts/system-prompts.js"
import type { NodeCompleteSummary, NodeEventEmitter, LlmConfig } from "@carefree-studio/shared"
import type { ParsedPrd } from "@carefree-studio/shared"

const ParsedPrdSchema = z.object({
  title: z.string().describe("게임 또는 프로젝트의 제목"),
  overview: z.string().describe("프로젝트 개요 및 핵심 가치 제안"),
  coreLoop: z.string().describe("플레이어가 반복적으로 수행하는 핵심 게임 루프 설명"),
  monetization: z.string().describe("수익화 전략 및 과금 모델"),
  targetUser: z.string().describe("타겟 유저 프로필 및 특성"),
  artStyle: z.string().describe("아트 스타일 및 시각적 방향성"),
  techSpec: z.string().describe("기술 스펙 및 구현 요건"),
  kpiMetrics: z.string().describe("성공 지표 및 KPI 메트릭"),
})

export class ParsePrdNode extends BaseNode<string, ParsedPrd> {
  readonly nodeId = "parse-prd"

  private readonly model: LlmModel

  constructor(emitter: NodeEventEmitter, graphId: string, llmConfig: LlmConfig) {
    super(emitter, graphId)
    this.model = createLlmModel(llmConfig)
  }

  protected async process(prdMarkdown: string): Promise<ParsedPrd> {
    this.emitProgress("PRD 문서를 분석하고 있어요", 50)

    const structured = this.model.withStructuredOutput(ParsedPrdSchema)
    const result = await structured.invoke([
      {
        role: "system",
        content: PARSE_PRD_PROMPT,
      },
      {
        role: "user",
        content: prdMarkdown,
      },
    ])

    this.emitProgress("PRD 파싱을 완료했어요", 90)

    return result as ParsedPrd
  }

  protected buildSummary(result: ParsedPrd): NodeCompleteSummary {
    return { kind: "parse", conceptTitle: result.title }
  }
}
