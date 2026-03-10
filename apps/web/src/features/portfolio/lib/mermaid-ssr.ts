import mermaid from "mermaid"

let initialized = false

function ensureInit() {
  if (initialized) return
  mermaid.initialize({
    startOnLoad: false,
    theme: "neutral",
    securityLevel: "loose",
    fontFamily: "sans-serif",
    flowchart: {
      htmlLabels: true,
      curve: "basis",
      padding: 12,
    },
  })
  initialized = true
}

export async function renderMermaidToSvg(diagram: string, id: string): Promise<string> {
  ensureInit()
  const { svg } = await mermaid.render(`mermaid-${id}`, diagram)
  return svg
}
