// packages/shared/src/constants/graph.ts

export const GENTITY_NODE_IDS = ["parse", "scout", "analyze", "create", "verify", "format"] as const
export type GentityNodeId = (typeof GENTITY_NODE_IDS)[number]

export const BUILDITY_NODE_IDS = ["generate", "build"] as const
export type BuildityNodeId = (typeof BUILDITY_NODE_IDS)[number]

export const GRAPH_LABELS = {
  gentity: "Gentity 분석",
  buildity: "Buildity PRD 빌드",
} as const
export type GraphId = keyof typeof GRAPH_LABELS

export const NODE_LABELS: Record<GraphId, Record<string, string>> = {
  gentity: {
    parse: "쿼리 분석",
    scout: "경쟁작 수집",
    analyze: "리뷰 분석",
    create: "컨셉 생성",
    verify: "품질 검증",
    format: "결과 포맷",
  },
  buildity: {
    generate: "칩 생성",
    build: "PRD 생성",
  },
} as const
