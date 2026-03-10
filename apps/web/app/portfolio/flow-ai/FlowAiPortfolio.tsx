"use client"

import {
  PortfolioHeader,
  HeroSection,
  OverviewSection,
  TechStackGrid,
  FeatureSection,
  ChallengeSection,
  FeatureSummaryCard,
  StatCard,
  TimelineSection,
  FooterSection,
  SectionReveal,
  StaggerContainer,
  flowAiProject,
} from "@features/portfolio"

const toc = [
  { id: "hero", label: "개요" },
  { id: "tech-stack", label: "기술 스택" },
  { id: "flow-search", label: "Flow Search" },
  { id: "agent-system", label: "Agent" },
  { id: "chatbot", label: "챗봇" },
  { id: "deep-think", label: "Deep Think" },
  { id: "citation", label: "출처" },
  { id: "challenge", label: "최적화" },
  { id: "summary", label: "기타 기능" },
  { id: "results", label: "성과" },
  { id: "timeline", label: "타임라인" },
]

export function FlowAiPortfolio() {
  const project = flowAiProject

  return (
    <>
      <PortfolioHeader toc={toc} />

      <HeroSection project={project} />

      <OverviewSection overview={project.overview} />

      <TechStackGrid stacks={project.techStacks} />

      {/* 핵심 기능 상세 5개 */}
      {project.features.map((feature, i) => (
        <FeatureSection key={feature.id} feature={feature} index={i} />
      ))}

      {/* CPU 최적화 */}
      <ChallengeSection challenge={project.challenge} />

      {/* 나머지 기능 요약 카드 */}
      <section id="summary" className="border-t border-border/30 py-12 print:py-6">
        <SectionReveal>
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-bold print:text-xl">기타 기능</h2>
            <StaggerContainer className="mt-6 grid gap-3 sm:grid-cols-2 print:mt-3">
              {project.summaryFeatures.map((f) => (
                <FeatureSummaryCard key={f.id} feature={f} />
              ))}
            </StaggerContainer>
          </div>
        </SectionReveal>
      </section>

      {/* 종합 성과 */}
      <section id="results" className="border-t border-border/30 py-12 print:py-6">
        <SectionReveal>
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-bold print:text-xl">종합 성과</h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 print:mt-3">
              {project.overallStats.map((stat, i) => (
                <StatCard key={i} stat={stat} />
              ))}
            </div>

            <div className="mt-8 print:mt-4">
              <h3 className="text-sm font-semibold text-muted-foreground">도입 기업</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.adoptionCompanies.map((company) => (
                  <span
                    key={company}
                    className="rounded-full border border-border/40 bg-card/50 px-3 py-1 text-xs print:border-gray-300"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* 타임라인 */}
      <TimelineSection timeline={project.timeline} />

      {/* 푸터 */}
      <FooterSection links={project.links} />
    </>
  )
}
