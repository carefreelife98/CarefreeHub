import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Bot } from "lucide-react"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "참여한 프로젝트 포트폴리오 모음",
}

const portfolios = [
  {
    title: "Flow AI",
    description: "협업 플랫폼 Flow의 AI 서비스 — 에이전트 시스템, 의도 기반 검색, RAG 챗봇",
    href: "/portfolio/flow-ai",
    icon: Bot,
  },
]

export default function PortfolioIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
      <p className="text-muted-foreground mb-10">참여한 프로젝트를 소개합니다</p>

      <div className="flex flex-col gap-4">
        {portfolios.map((portfolio) => (
          <Link
            key={portfolio.href}
            href={portfolio.href}
            className="group flex items-center justify-between rounded-xl border border-border p-6 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-4">
              <portfolio.icon className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {portfolio.title}
                </h2>
                <p className="text-sm text-muted-foreground">{portfolio.description}</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
