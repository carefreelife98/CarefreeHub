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

  // 노션 정확한 스타일 인라인 코드
  return (
    <code
      style={{
        color: "#EB5757",
        background: "rgba(135, 131, 120, 0.15)",
        borderRadius: "3px",
        padding: "0.2em 0.4em",
        fontSize: "85%",
        fontFamily:
          '"SFMono-Regular", Menlo, Consolas, "PT Mono", "Liberation Mono", Courier, monospace',
        lineHeight: "normal",
      }}
    >
      {content}
    </code>
  )
}
