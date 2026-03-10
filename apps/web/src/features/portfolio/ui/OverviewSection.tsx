import { SectionReveal } from "./SectionReveal"

interface OverviewSectionProps {
  overview: string[]
}

export function OverviewSection({ overview }: OverviewSectionProps) {
  return (
    <section id="overview" className="py-12 print:py-6">
      <SectionReveal>
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold print:text-xl">프로젝트 개요</h2>
          <div className="mt-6 space-y-4 print:mt-3 print:space-y-2">
            {overview.map((text, i) => (
              <p key={i} className="text-sm leading-relaxed text-muted-foreground print:text-xs">
                {text}
              </p>
            ))}
          </div>
        </div>
      </SectionReveal>
    </section>
  )
}
