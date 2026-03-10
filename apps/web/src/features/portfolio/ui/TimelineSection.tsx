import type { TimelineEvent } from "../lib/types"
import { cn } from "@shared/lib"
import { SectionReveal, StaggerContainer, StaggerItem } from "./SectionReveal"

interface TimelineSectionProps {
  timeline: TimelineEvent[]
}

export function TimelineSection({ timeline }: TimelineSectionProps) {
  return (
    <section id="timeline" className="border-t border-border/30 py-12 print:py-6">
      <SectionReveal>
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold print:text-xl">개발 타임라인</h2>

          <StaggerContainer className="mt-8 relative print:mt-4">
            {/* 세로 라인 */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border/50 print:bg-gray-300" />

            <div className="space-y-6 print:space-y-3">
              {timeline.map((event, i) => (
                <StaggerItem key={i}>
                  <div className="relative flex gap-4 pl-6">
                    {/* 도트 */}
                    <div
                      className={cn(
                        "absolute left-0 top-1.5 size-[15px] rounded-full border-2",
                        event.highlight
                          ? "border-primary bg-primary/20 print:border-gray-800 print:bg-gray-200"
                          : "border-border bg-background print:border-gray-400 print:bg-white"
                      )}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-primary tabular-nums print:text-gray-800">
                          {event.month}
                        </span>
                        {event.commits && (
                          <span className="text-[10px] rounded-full bg-muted px-2 py-0.5 text-muted-foreground print:bg-gray-100">
                            {event.commits} commits
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm font-semibold">{event.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </SectionReveal>
    </section>
  )
}
