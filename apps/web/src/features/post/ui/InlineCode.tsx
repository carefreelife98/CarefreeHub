import { ReactNode } from "react"

interface InlineCodeProps {
  children?: ReactNode
  className?: string
}

// 백틱 제거 헬퍼
function removeBackticks(content: ReactNode): ReactNode {
  if (typeof content === "string") {
    return content.replace(/^`+|`+$/g, "")
  }
  if (Array.isArray(content)) {
    return content.map(removeBackticks)
  }
  return content
}

export function InlineCode({ children, className }: InlineCodeProps) {
  // pre > code 인 경우는 CodeBlock에서 처리하므로 스킵
  const hasLanguage = className?.startsWith("language-")

  // 블록 코드는 그대로 반환 (CodeBlock에서 처리)
  if (hasLanguage) {
    return <code className={className}>{children}</code>
  }

  // 백틱 제거
  const content = removeBackticks(children)

  // 노션식 인라인 코드 — Warm Ink 코랄 액센트 + 따뜻한 중성 배경
  return (
    <code className="rounded-[3px] px-[0.4em] py-[0.2em] text-[85%] leading-normal text-[oklch(0.5_0.17_25)] dark:text-[oklch(0.78_0.14_25)] bg-[oklch(0.92_0.02_60)] dark:bg-[oklch(0.27_0.01_50)] font-mono">
      {content}
    </code>
  )
}
