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

/* eslint-disable react-hooks/static-components -- Velite/MDX 표준: 코드 문자열을 컴포넌트로 컴파일, useMemo 캐시로 idempotent */
export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code)

  return (
    // 본문은 65ch 까지만 — 가독 한계. max-w-none을 쓰지 않는다.
    // 이미지/코드블록/표는 prose 내부에서 자체 폭을 가지므로 65ch을 자연스럽게 넘는다.
    <div className="prose prose-neutral dark:prose-invert max-w-[68ch]">
      <Component components={mdxComponents} />
    </div>
  )
}
/* eslint-enable react-hooks/static-components */
