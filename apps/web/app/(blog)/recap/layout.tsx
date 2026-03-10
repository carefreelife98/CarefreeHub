import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Recap | CarefreeHub",
  description: "연간 활동 회고",
}

export default function RecapLayout({ children }: { children: React.ReactNode }) {
  // 풀스크린 레이아웃 - 헤더/사이드바 제외
  return <div className="min-h-screen bg-[#0f0f0f]">{children}</div>
}
