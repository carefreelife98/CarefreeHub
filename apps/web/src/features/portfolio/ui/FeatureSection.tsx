"use client"

import { useMemo, useState } from "react"
import type { Feature, FeatureSubSection } from "../lib/types"
import { RoleBadge } from "./RoleBadge"
import { MermaidDiagram } from "./MermaidDiagram"
import { ImageWithCaption } from "./ImageWithCaption"
import { ImageLightbox } from "./ImageLightbox"
import { StatCard } from "./StatCard"
import { SectionReveal } from "./SectionReveal"

interface FeatureSectionProps {
  feature: Feature
  index: number
}

export function FeatureSection({ feature, index }: FeatureSectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const hasSubSections = feature.subSections && feature.subSections.length > 0
  const hasMainContent =
    feature.designs.length > 0 || feature.mermaidDiagram || feature.screenshots.length > 0

  // Collect all images for the lightbox (main + subSections)
  const allImages = useMemo(() => {
    const images = [...feature.screenshots]
    if (feature.subSections) {
      for (const sub of feature.subSections) {
        images.push(...sub.screenshots)
      }
    }
    return images
  }, [feature.screenshots, feature.subSections])

  // Track the offset for each subSection's images in the flat array
  let imageOffset = feature.screenshots.length

  return (
    <section
      id={feature.id}
      className="border-t border-border/30 py-12 print:py-6 print:break-inside-avoid-page"
    >
      <SectionReveal>
        <div className="mx-auto max-w-5xl px-6">
          <RoleBadge roles={feature.roles} />

          <h2 className="mt-3 text-2xl font-bold print:text-xl">{feature.title}</h2>

          {/* 문제 */}
          <div className="mt-6 print:mt-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              문제
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground print:text-xs">
              {feature.problem}
            </p>
          </div>

          {/* 기본 핵심 설계 (subSections가 없는 경우) */}
          {hasMainContent && (
            <>
              {feature.designs.length > 0 && (
                <div className="mt-8 print:mt-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    핵심 설계
                  </h3>
                  <div className="mt-3 space-y-3 print:space-y-2">
                    {feature.designs.map((design, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary print:bg-gray-200 print:text-gray-700">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium">{design.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {design.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {feature.mermaidDiagram && (
                <div className="mt-8 print:hidden">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    아키텍처
                  </h3>
                  <MermaidDiagram chart={feature.mermaidDiagram} id={feature.id} />
                </div>
              )}

              {feature.screenshots.length > 0 && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 print:mt-3">
                  {feature.screenshots.map((ss, i) => (
                    <ImageWithCaption key={i} screenshot={ss} onClick={() => setLightboxIndex(i)} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* 하위 섹션 */}
          {hasSubSections &&
            feature.subSections!.map((sub, si) => {
              const currentOffset = imageOffset
              imageOffset += sub.screenshots.length

              return (
                <div
                  key={si}
                  className="mt-10 rounded-lg border border-border/20 bg-muted/30 p-6 print:mt-6 print:bg-white print:border-gray-200"
                >
                  <h3 className="text-lg font-bold print:text-base">{sub.title}</h3>

                  {/* 설계 포인트 */}
                  {sub.designs.length > 0 && (
                    <div className="mt-5 print:mt-3">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        핵심 설계
                      </h4>
                      <div className="mt-3 space-y-3 print:space-y-2">
                        {sub.designs.map((design, i) => (
                          <div key={i} className="flex gap-3">
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary print:bg-gray-200 print:text-gray-700">
                              {i + 1}
                            </span>
                            <div>
                              <p className="text-sm font-medium">{design.title}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {design.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 아키텍처 다이어그램 */}
                  {sub.mermaidDiagram && (
                    <div className="mt-6 print:hidden">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        아키텍처
                      </h4>
                      <MermaidDiagram chart={sub.mermaidDiagram} id={`${feature.id}-sub-${si}`} />
                    </div>
                  )}

                  {/* 스크린샷 */}
                  {sub.screenshots.length > 0 && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 print:mt-3">
                      {sub.screenshots.map((ss, i) => (
                        <ImageWithCaption
                          key={i}
                          screenshot={ss}
                          onClick={() => setLightboxIndex(currentOffset + i)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

          {/* 성과 */}
          <div className="mt-8 print:mt-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-indigo-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent print:text-gray-700">
              성과
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3">
              {feature.stats.map((stat, i) => (
                <StatCard key={i} stat={stat} />
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={allImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  )
}
