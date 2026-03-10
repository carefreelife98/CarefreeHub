"use client"

import Link from "next/link"
import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@shared/ui"
import type { PortfolioProject } from "../lib/types"
import { SectionReveal } from "./SectionReveal"

interface FooterSectionProps {
  links: PortfolioProject["links"]
}

export function FooterSection({ links }: FooterSectionProps) {
  return (
    <section id="footer" className="border-t border-border/30 py-12 print:py-6">
      <SectionReveal>
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col items-center gap-6 text-center">
            {links.recap && (
              <Link
                href={links.recap}
                className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                2025년 회고에서 자세히 읽기
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}

            <div className="flex items-center gap-4">
              {links.github && (
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="size-5" />
                </a>
              )}
              {links.linkedin && (
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Linkedin className="size-5" />
                </a>
              )}
              {links.email && (
                <a
                  href={`mailto:${links.email}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="size-5" />
                </a>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 print:hidden"
              onClick={() => window.print()}
            >
              <Download className="size-3.5" />
              PDF로 다운로드
            </Button>

            <p className="text-xs text-muted-foreground/50 print:hidden">
              Designed by Carefreelife98
            </p>
          </div>
        </div>
      </SectionReveal>
    </section>
  )
}
