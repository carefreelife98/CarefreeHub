import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Recap | CarefreeHub",
  description: "연간 활동 회고",
}

export default function RecapLayout({ children }: { children: React.ReactNode }) {
  // 풀스크린 레이아웃 - 헤더/사이드바 제외, 의도된 다크 surface (Warm Ink 다크톤)
  return (
    <div className="dark min-h-[100dvh] bg-background text-foreground antialiased">{children}</div>
  )
}
