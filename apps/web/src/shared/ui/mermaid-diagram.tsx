"use client"

import { useEffect, useId, useState } from "react"
import { useTheme } from "next-themes"
import { cn } from "@shared/lib"

interface MermaidDiagramProps {
  chart: string
  id?: string
  className?: string
}

/** ```mermaid 코드펜스·포트폴리오 다이어그램 공용 렌더러 (mermaid는 번들이 커서 동적 로드) */
export function MermaidDiagram({ chart, id, className }: MermaidDiagramProps) {
  const autoId = useId().replace(/[^a-zA-Z0-9]/g, "")
  const renderId = id ?? autoId
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = useState<string>("")

  useEffect(() => {
    let cancelled = false
    import("mermaid")
      .then(({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === "dark" ? "dark" : "neutral",
          securityLevel: "loose",
          fontFamily: "sans-serif",
          flowchart: { htmlLabels: true, curve: "basis", padding: 12 },
        })
        return mermaid.render(`mermaid-${renderId}`, chart)
      })
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg)
      })
      .catch(console.error)
    return () => {
      cancelled = true
    }
  }, [chart, renderId, resolvedTheme])

  return (
    <div
      className={cn(
        "my-6 flex justify-center overflow-x-auto rounded-lg border border-border/40 bg-muted/30 p-4 [&_svg]:max-w-full",
        className
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
