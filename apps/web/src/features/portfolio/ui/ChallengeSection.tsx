"use client"

import { useState } from "react"
import Image from "next/image"
import type { PortfolioProject } from "../lib/types"
import { ImageLightbox } from "./ImageLightbox"
import { SectionReveal } from "./SectionReveal"

interface ChallengeSectionProps {
  challenge: PortfolioProject["challenge"]
}

export function ChallengeSection({ challenge }: ChallengeSectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const images = [
    { src: challenge.beforeImage, alt: "Before - CPU 부하", caption: "Before" },
    { src: challenge.afterImage, alt: "After - CPU 부하 개선", caption: "After" },
  ]

  return (
    <section id="challenge" className="border-t border-border/30 py-12 print:py-6">
      <SectionReveal>
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold print:text-xl">기술적 도전 & 해결</h2>
          <h3 className="mt-2 text-lg text-muted-foreground print:text-sm">{challenge.title}</h3>

          <div className="mt-8 space-y-6 print:mt-4 print:space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                문제
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground print:text-xs">
                {challenge.problem}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                분석
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground print:text-xs">
                {challenge.analysis}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                해결
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground print:text-xs">
                {challenge.solution}
              </p>
            </div>
          </div>

          {/* Before/After 이미지 */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 print:mt-4">
            <figure>
              <div
                className="overflow-hidden rounded-lg border border-red-500/30 cursor-pointer transition-opacity hover:opacity-90 print:cursor-default"
                onClick={() => setLightboxIndex(0)}
              >
                <Image
                  src={challenge.beforeImage}
                  alt="Before - CPU 부하"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                  loading="eager"
                  unoptimized
                />
              </div>
              <figcaption className="mt-2 text-center text-sm text-red-400 print:text-red-600">
                Before
              </figcaption>
            </figure>
            <figure>
              <div
                className="overflow-hidden rounded-lg border border-green-500/30 cursor-pointer transition-opacity hover:opacity-90 print:cursor-default"
                onClick={() => setLightboxIndex(1)}
              >
                <Image
                  src={challenge.afterImage}
                  alt="After - CPU 부하 개선"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                  loading="eager"
                  unoptimized
                />
              </div>
              <figcaption className="mt-2 text-center text-sm text-green-400 print:text-green-600">
                After
              </figcaption>
            </figure>
          </div>

          {/* 결과 수치 */}
          <div className="mt-8 print:mt-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {challenge.results.map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between rounded-lg border border-border/40 bg-card/50 px-4 py-3"
                >
                  <span className="text-sm text-muted-foreground">{r.label}</span>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="text-red-400 line-through print:text-red-600">{r.before}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-green-400 print:text-green-600">{r.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  )
}
