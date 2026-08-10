"use client"

import * as runtime from "react/jsx-runtime"
import { useMemo } from "react"
import { CodeBlock } from "./CodeBlock"
import { InlineCode } from "./InlineCode"

// MDX 컴포넌트 매핑
const mdxComponents = {
  pre: CodeBlock,
  code: InlineCode,
}

interface MDXContentProps {
  code: string
}

function useMDXComponent(code: string) {
  return useMemo(() => {
    const fn = new Function(code)
    return fn({ ...runtime }).default
  }, [code])
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code)

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {/* velite가 컴파일한 MDX 코드를 런타임에 평가하는 표준 패턴 — code가 바뀌지 않는 한 useMemo로 안정적 */}
      {/* eslint-disable-next-line react-hooks/static-components */}
      <Component components={mdxComponents} />
    </div>
  )
}
