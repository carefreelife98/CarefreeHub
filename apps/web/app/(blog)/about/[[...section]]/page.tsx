import { Metadata } from "next"
import Link from "next/link"
import { Construction } from "lucide-react"

export const metadata: Metadata = {
  title: "About",
  description: "소개 페이지 준비중입니다",
}

// 헤더 메뉴에서 연결되는 /about, /about/introduction, /about/skills, /about/projects
export async function generateStaticParams() {
  return [
    { section: [] },
    { section: ["introduction"] },
    { section: ["skills"] },
    { section: ["projects"] },
  ]
}

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-40 text-center">
      <Construction className="w-12 h-12 text-muted-foreground" />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">준비중인 페이지입니다</h1>
        <p className="text-muted-foreground">소개 페이지를 열심히 만들고 있어요. 조금만 기다려 주세요 ☺️</p>
      </div>
      <Link
        href="/"
        className="text-sm text-primary hover:underline underline-offset-4 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}
