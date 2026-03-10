"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { Badge } from "@shared/ui"
import { cn } from "@shared/lib"
import type { SummaryFeature } from "../lib/types"
import { StaggerItem } from "./SectionReveal"
import { ImageLightbox } from "./ImageLightbox"

interface FeatureSummaryCardProps {
  feature: SummaryFeature
}

export function FeatureSummaryCard({ feature }: FeatureSummaryCardProps) {
  const [open, setOpen] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)

  return (
    <StaggerItem>
      <div className="rounded-lg border border-border/40 bg-card/50 print:border print:bg-white">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between px-4 py-3 text-left print:pointer-events-none"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{feature.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {feature.stat.label}: {feature.stat.value}
            </p>
          </div>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform print:hidden",
              open && "rotate-180"
            )}
          />
        </button>

        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            "print:grid-rows-[1fr]"
          )}
        >
          <div className="overflow-hidden">
            <div className="border-t border-border/30 px-4 py-3">
              <p className="text-xs leading-relaxed text-muted-foreground">{feature.description}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {feature.techTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
              {feature.screenshot && (
                <figure className="mt-3">
                  <Image
                    src={feature.screenshot.src}
                    alt={feature.screenshot.alt}
                    width={600}
                    height={400}
                    className="cursor-pointer rounded-md border border-border/30 transition-opacity hover:opacity-90"
                    onClick={() => setShowLightbox(true)}
                    loading="eager"
                    unoptimized
                  />
                  <figcaption className="mt-1 text-[10px] text-muted-foreground/60">
                    {feature.screenshot.caption}
                  </figcaption>
                </figure>
              )}
            </div>
          </div>
        </div>
      </div>
      {showLightbox && feature.screenshot && (
        <ImageLightbox
          images={[feature.screenshot]}
          currentIndex={0}
          onClose={() => setShowLightbox(false)}
          onNavigate={() => {}}
        />
      )}
    </StaggerItem>
  )
}
