"use client"

import Image from "next/image"
import { SectionReveal, StaggerContainer, StaggerItem } from "./SectionReveal"
import type { TechStackCategory } from "../lib/types"

interface TechStackGridProps {
  stacks: TechStackCategory[]
}

export function TechStackGrid({ stacks }: TechStackGridProps) {
  return (
    <section id="tech-stack" className="py-12 print:py-6">
      <SectionReveal>
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold print:text-xl">기술 스택</h2>

          <div className="mt-8 grid gap-8 sm:grid-cols-2 print:mt-4 print:gap-4">
            {stacks.map((category) => (
              <div key={category.label}>
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground print:text-xs">
                  {category.label}
                </h3>
                <StaggerContainer className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <StaggerItem key={item.name}>
                      <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-card/50 px-3 py-2 text-sm print:px-2 print:py-1 print:text-xs">
                        {item.icon && (
                          <Image
                            src={`https://cdn.simpleicons.org/${item.icon}/${item.color || "888"}`}
                            alt={item.name}
                            width={16}
                            height={16}
                            className="size-4 print:size-3"
                            unoptimized
                          />
                        )}
                        <span>{item.name}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>
    </section>
  )
}
