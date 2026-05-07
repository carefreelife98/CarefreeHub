import Image from "next/image"
import type { PortfolioProject } from "../lib/types"
import { SectionReveal } from "./SectionReveal"

interface HeroSectionProps {
  project: PortfolioProject
}

export function HeroSection({ project }: HeroSectionProps) {
  return (
    <section id="hero" className="pb-10 pt-10 sm:pb-12 sm:pt-16 print:pt-8 print:pb-6">
      <SectionReveal>
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Image
              src={project.logo}
              alt={project.title}
              width={56}
              height={56}
              className="size-12 sm:size-14 rounded-xl print:size-12"
              unoptimized
            />
            <div className="min-w-0">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight print:text-2xl break-keep"
                style={{ letterSpacing: "-0.02em" }}
              >
                {project.title}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                {project.company} · {project.team} · {project.period}
              </p>
            </div>
          </div>

          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed print:text-sm break-keep">
            {project.subtitle}
          </p>

          <p className="mt-2 text-xs sm:text-sm text-muted-foreground/80">{project.role}</p>

          <div className="mt-6 sm:mt-8">
            {/* 모바일 1열, 데스크톱 3열 — 360px에서 숫자가 줄바꿈되지 않도록 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              {project.highlights.map((h) => (
                <div
                  key={h.label}
                  className="flex sm:flex-col items-center sm:items-stretch justify-between sm:justify-start gap-3 sm:gap-1 rounded-lg border border-border/40 bg-card/50 px-4 py-3 sm:text-center"
                >
                  <p className="text-xs text-muted-foreground sm:order-3 sm:mt-0.5">{h.label}</p>
                  <div className="flex items-baseline gap-1.5 sm:flex-col sm:items-stretch sm:gap-0 sm:order-1">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold print:text-lg tabular-nums">
                      {h.value}
                    </p>
                    {h.trend && (
                      <p className="text-[11px] sm:text-xs font-medium text-[oklch(0.55_0.13_160)] dark:text-[oklch(0.75_0.12_160)] sm:order-2">
                        {h.trend} ↑
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {project.highlightBase && (
              <p className="mt-2 text-right text-[11px] sm:text-xs text-muted-foreground/60">
                * {project.highlightBase}
              </p>
            )}
          </div>
        </div>
      </SectionReveal>
    </section>
  )
}
