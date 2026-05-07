"use client"

import { useState, ReactNode } from "react"
import { Check, Copy } from "lucide-react"
import { Highlight, themes } from "prism-react-renderer"
import { toast } from "sonner"

interface CodeBlockProps {
  children?: ReactNode
}

export function CodeBlock({ children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const codeElement = children as React.ReactElement<{
    children?: string
    className?: string
  }>

  const codeClassName = codeElement?.props?.className || ""
  const language = codeClassName.replace(/language-/, "") || "text"
  const code = (codeElement?.props?.children as string)?.trim() || ""

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success("코드가 클립보드에 복사되었습니다.")
    } catch (err) {
      console.error("복사 실패:", err)
      toast.error("복사에 실패했습니다.")
    }
  }

  return (
    <div className="group relative my-6 rounded-xl overflow-hidden shadow-lg">
      {/* Mac 타이틀 바 */}
      <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-[#2d2d2d] border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2 shrink-0">
          {/* Traffic light buttons - 모바일에선 시각 노이즈라 숨김 */}
          <div className="hidden sm:flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
          </div>
        </div>

        {/* 언어 표시 */}
        <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-mono truncate">
          {language}
        </span>

        {/* 복사 버튼 — 모바일은 항상 노출, 데스크톱은 hover/focus 시 */}
        <button
          onClick={handleCopy}
          className="shrink-0 p-2 sm:p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all motion-reduce:transition-none opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40"
          aria-label={copied ? "복사 완료" : "코드 복사"}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" aria-hidden="true" />
          ) : (
            <Copy className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* 코드 영역 */}
      <Highlight theme={themes.oneDark} code={code} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} overflow-x-auto overscroll-x-contain p-3 sm:p-4 text-[12px] sm:text-sm leading-relaxed`}
            style={{ ...style, margin: 0, borderRadius: 0 }}
          >
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {/* 라인 번호 — 모바일에선 가로폭을 더 깎지 않도록 숨김 */}
                  <span
                    className="hidden sm:inline-block w-8 mr-4 text-right text-gray-600 select-none text-xs"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}
