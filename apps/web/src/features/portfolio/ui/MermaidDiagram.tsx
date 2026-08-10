"use client"

import { useEffect, useRef, useState } from "react"

interface MermaidDiagramProps {
  chart: string
  id: string
}

export function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>("")

  useEffect(() => {
    let cancelled = false
    // mermaid는 번들이 매우 커서 다이어그램이 실제 렌더될 때만 동적 로드
    import("mermaid")
      .then(({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "loose",
          fontFamily: "sans-serif",
          flowchart: { htmlLabels: true, curve: "basis", padding: 12 },
        })
        return mermaid.render(`mermaid-${id}`, chart)
      })
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg)
      })
      .catch(console.error)
    return () => {
      cancelled = true
    }
  }, [chart, id])

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center overflow-x-auto rounded-lg border border-border/40 bg-muted/30 p-4 print:hidden [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
