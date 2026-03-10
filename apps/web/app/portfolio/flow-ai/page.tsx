import type { Metadata } from "next"
import { FlowAiPortfolio } from "./FlowAiPortfolio"

export const metadata: Metadata = {
  title: "Flow AI Portfolio | CarefreeHub",
  description:
    "협업 플랫폼 Flow의 AI 서비스 - 에이전트 시스템, 의도 기반 검색, RAG 챗봇 포트폴리오",
}

export default function FlowAiPage() {
  return <FlowAiPortfolio />
}
