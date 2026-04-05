"use client"

import { Streamdown } from "streamdown"
import { code } from "@streamdown/code"
import { cjk } from "@streamdown/cjk"
import "streamdown/styles.css"
import type { GameConcept } from "@carefree-studio/shared"

interface Props {
  concept: GameConcept
  analysisId: string
  provider?: string
  model?: string
}

export function ConceptCard({ concept }: Props) {
  const content = concept.markdown || buildFallbackMarkdown(concept)

  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      <Streamdown plugins={{ code, cjk }} mode="static">
        {content}
      </Streamdown>
    </div>
  )
}

function buildFallbackMarkdown(concept: GameConcept): string {
  return `# ${concept.title}

## 타겟 유저
${concept.targetUser}

## 코어 루프
${concept.coreLoop}

## 게임 메커니즘
${concept.mechanics.map((m) => `- **${m}**`).join("\n")}

## 차별화 포인트
${concept.differentiation}

## 수익화 전략
${concept.monetization}

## CPI 테스트 플랜
${concept.cpiTestPlan}`
}
