// apps/api/src/buildity/prd-sections.ts

import { MARKDOWN_GUIDE, MERMAID_GUIDE } from "@carefree-studio/gentity-core"

export interface SectionDef {
  index: number
  title: string
  group: "A" | "B"
  prompt: string
}

export const PRD_SECTIONS: SectionDef[] = [
  {
    index: 0,
    title: "개요",
    group: "A",
    prompt: `Write section "## 1. 개요" of a game PRD.
Include: game title, one-line pitch, platform, target launch, key features summary.
${MARKDOWN_GUIDE}`,
  },
  {
    index: 1,
    title: "코어 루프",
    group: "A",
    prompt: `Write section "## 2. 코어 루프" of a game PRD.
Include: detailed core game loop explanation, progression system, feedback loops.
Include a Mermaid flowchart diagram of the core loop.
${MARKDOWN_GUIDE}
${MERMAID_GUIDE}`,
  },
  {
    index: 2,
    title: "수익화 전략",
    group: "B",
    prompt: `Write section "## 3. 수익화 전략" of a game PRD.
Include: monetization model, IAP structure, ad strategy, pricing.
Include a Mermaid flowchart or sequence diagram of the monetization funnel.
${MARKDOWN_GUIDE}
${MERMAID_GUIDE}`,
  },
  {
    index: 3,
    title: "타겟 유저",
    group: "A",
    prompt: `Write section "## 4. 타겟 유저" of a game PRD.
Include: target demographics, player personas, play patterns, motivation drivers.
${MARKDOWN_GUIDE}`,
  },
  {
    index: 4,
    title: "아트 스타일",
    group: "A",
    prompt: `Write section "## 5. 아트 스타일" of a game PRD.
Include: visual style direction, color palette, UI/UX guidelines, reference games.
${MARKDOWN_GUIDE}`,
  },
  {
    index: 5,
    title: "기술 요구사항",
    group: "B",
    prompt: `Write section "## 6. 기술 요구사항" of a game PRD.
Include: engine/framework, platform requirements, backend infrastructure, performance targets.
${MARKDOWN_GUIDE}`,
  },
  {
    index: 6,
    title: "KPI & 성공 기준",
    group: "B",
    prompt: `Write section "## 7. KPI & 성공 기준" of a game PRD.
Include: key metrics (CPI, retention, ARPU, LTV), success thresholds, A/B test plan, launch milestones.
${MARKDOWN_GUIDE}`,
  },
]

export const SECTION_GROUPS = ["A", "B"] as const
