import Image from "next/image"
import type { PortfolioProject } from "../lib/types"
import { SectionReveal } from "./SectionReveal"

interface HeroSectionProps {
  project: PortfolioProject
}

export function HeroSection({ project }: HeroSectionProps) {
  return (
    <section id="hero" className="pb-12 pt-16 print:pt-8 print:pb-6">
      <SectionReveal>
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center gap-4">
            <Image
              src={project.logo}
              alt={project.title}
              width={56}
              height={56}
              className="rounded-xl print:size-12"
              unoptimized
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl print:text-2xl">
                {project.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {project.company} · {project.team} · {project.period}
              </p>
            </div>
          </div>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed print:text-sm">
            {project.subtitle}
          </p>

          <p className="mt-2 text-sm text-muted-foreground/80">{project.role}</p>

          <div className="mt-8">
            <div className="grid grid-cols-3 gap-3">
              {project.highlights.map((h) => (
                <div
                  key={h.label}
                  className="rounded-lg border border-border/40 bg-card/50 px-4 py-3 text-center"
                >
                  <p className="text-xl font-bold sm:text-2xl print:text-lg">{h.value}</p>
                  {h.trend && <p className="text-xs font-medium text-emerald-500">{h.trend} ↑</p>}
                  <p className="mt-0.5 text-xs text-muted-foreground">{h.label}</p>
                </div>
              ))}
            </div>
            {project.highlightBase && (
              <p className="mt-2 text-right text-xs text-muted-foreground/60">
                * {project.highlightBase}
              </p>
            )}
          </div>
        </div>
      </SectionReveal>
    </section>
  )
}
