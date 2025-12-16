"use client"

import { useState, useRef, ReactNode } from "react"
import { Check, Copy } from "lucide-react"
import { Highlight, themes } from "prism-react-renderer"
import { toast } from "sonner"

interface CodeBlockProps {
  children?: ReactNode
  className?: string
  [key: string]: unknown
}

export function CodeBlock({ children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  // children이 code 요소인 경우 처리
  const codeElement = children as React.ReactElement<{
    children?: string
    className?: string
  }>

  // code 요소의 props에서 언어와 코드 추출
  const codeClassName = codeElement?.props?.className || ""
  const language = codeClassName.replace(/language-/, "") || "text"
  const code = (codeElement?.props?.children as string)?.trim() || ""

  // 인라인 코드인 경우 (children이 문자열인 경우)
  if (typeof children === "string") {
    return (
      <pre className="my-6 rounded-xl overflow-hidden" {...props}>
        <code>{children}</code>
      </pre>
    )
  }

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
      <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2">
          {/* Traffic light buttons */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
          </div>
        </div>

        {/* 언어 표시 */}
        <span className="text-xs text-gray-500 uppercase font-mono">{language}</span>

        {/* 복사 버튼 */}
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
          aria-label="코드 복사"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* 코드 영역 */}
      <Highlight theme={themes.oneDark} code={code} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            ref={preRef}
            className={`${className} overflow-x-auto p-4 text-sm`}
            style={{ ...style, margin: 0, borderRadius: 0 }}
          >
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {/* 라인 번호 */}
                  <span className="inline-block w-8 mr-4 text-right text-gray-600 select-none text-xs">
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
