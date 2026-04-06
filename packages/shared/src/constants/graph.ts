// packages/shared/src/constants/graph.ts

export const GENTITY_NODE_IDS = ["parse", "scout", "analyze", "create", "verify", "format"] as const
export type GentityNodeId = (typeof GENTITY_NODE_IDS)[number]

export const BUILDITY_NODE_IDS = ["generate", "build"] as const
export type BuildityNodeId = (typeof BUILDITY_NODE_IDS)[number]

export const CRAFTITY_NODE_IDS = [
  "parse-prd",
  "design-structure",
  "setup-assets",
  "generate-phase-1",
  "generate-phase-2",
  "generate-phase-3",
  "generate-phase-4",
  "ast-validate",
  "finalize",
] as const
export type CraftityNodeId = (typeof CRAFTITY_NODE_IDS)[number]

export const GRAPH_LABELS = {
  gentity: "Gentity 분석",
  buildity: "Buildity PRD 빌드",
  craftity: "Craftity 게임 만들기",
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
  craftity: {
    "parse-prd": "PRD 파싱",
    "design-structure": "구조 설계",
    "setup-assets": "에셋 설정",
    "generate-phase-1": "타입/설정 생성",
    "generate-phase-2": "오브젝트 생성",
    "generate-phase-3": "씬 생성",
    "generate-phase-4": "메인 생성",
    "ast-validate": "컴파일 검증",
    finalize: "최종화",
  },
} as const
