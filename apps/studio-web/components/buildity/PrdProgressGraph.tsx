"use client"

import { CheckIcon, LoaderIcon, CircleIcon } from "lucide-react"

// Group A: indices 0(개요), 1(코어루프), 3(타겟유저), 4(아트스타일)
// Group B: indices 2(수익화), 5(기술요구사항), 6(KPI)
const GROUP_A = [0, 1, 3, 4]
const GROUP_B = [2, 5, 6]

interface Props {
  sectionTitles: string[]
  sections: string[]
  sectionDone: Set<number>
  isStreaming: boolean
}

function NodeBadge({
  index,
  title,
  sections,
  sectionDone,
}: {
  index: number
  title: string
  sections: string[]
  sectionDone: Set<number>
}) {
  const done = sectionDone.has(index)
  const inProgress = !done && sections[index] && sections[index].length > 0

  let bgClass = "bg-muted text-muted-foreground border-border"
  let icon = <CircleIcon className="size-3" />

  if (done) {
    bgClass = "bg-primary text-primary-foreground border-primary"
    icon = <CheckIcon className="size-3" />
  } else if (inProgress) {
    bgClass = "bg-primary/10 text-primary border-primary/30"
    icon = <LoaderIcon className="size-3 animate-spin" />
  }

  return (
    <div
      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${bgClass}`}
    >
      {icon}
      <span>{title}</span>
    </div>
  )
}

export function PrdProgressGraph({ sectionTitles, sections, sectionDone, isStreaming }: Props) {
  if (!isStreaming || sectionTitles.length === 0) return null

  const groupADone = GROUP_A.every((i) => sectionDone.has(i))

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-0">
      {/* Group A label */}
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
        1단계: 기본 섹션 생성
      </p>

      {/* Group A nodes */}
      <div className="flex flex-wrap gap-2">
        {GROUP_A.map((i) => (
          <NodeBadge
            key={i}
            index={i}
            title={sectionTitles[i] ?? `섹션 ${i + 1}`}
            sections={sections}
            sectionDone={sectionDone}
          />
        ))}
      </div>

      {/* Connector */}
      <div className="flex items-center gap-2 py-2 pl-6">
        <div
          className={`w-px h-6 ${groupADone ? "bg-primary" : "bg-border"} transition-colors duration-500`}
        />
        <span
          className={`text-[10px] ${groupADone ? "text-primary" : "text-muted-foreground/40"} transition-colors duration-500`}
        >
          ▼ 기본 섹션 완료 대기
        </span>
      </div>

      {/* Group B label */}
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
        2단계: 상세 섹션 생성
      </p>

      {/* Group B nodes */}
      <div className="flex flex-wrap gap-2">
        {GROUP_B.map((i) => (
          <NodeBadge
            key={i}
            index={i}
            title={sectionTitles[i] ?? `섹션 ${i + 1}`}
            sections={sections}
            sectionDone={sectionDone}
          />
        ))}
      </div>
    </div>
  )
}
