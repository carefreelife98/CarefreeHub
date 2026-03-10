import Link from "next/link"
import { getAvailableRecapYears } from "@features/recap"
import { ArrowRight, ScrollText } from "lucide-react"

export default function RecapLandingPage() {
  const years = getAvailableRecapYears()
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8">
      {/* 헤더 */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-white/50 hover:text-white transition-colors text-sm">
          ← 홈으로 돌아가기
        </Link>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          <ScrollText className="w-8 h-8 text-blue-400" />
          <span className="text-white/60 text-lg tracking-widest">RECAP</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          나의 연간 기록
        </h1>

        <p className="text-lg text-white/50 mb-12">한 해 동안의 활동을 돌아보세요</p>

        {/* 연도 선택 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto">
          {years.length > 0 ? (
            years.map((year) => (
              <Link
                key={year}
                href={`/recap/${year}`}
                className="group relative p-6 rounded-2xl bg-white/5 border border-white/10
                  hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <span className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {year}
                </span>
                <ArrowRight
                  className="absolute bottom-4 right-4 w-5 h-5 text-white/30 
                  group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300"
                />
                {year === currentYear && (
                  <span
                    className="absolute top-3 right-3 px-2 py-0.5 text-xs bg-blue-500/20 
                    text-blue-400 rounded-full"
                  >
                    올해
                  </span>
                )}
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-white/40">
              <p>아직 작성된 포스트가 없습니다</p>
              <Link href="/posts" className="text-blue-400 hover:underline mt-2 inline-block">
                첫 번째 글 작성하기 →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 푸터 힌트 */}
      <div className="absolute bottom-8 text-white/30 text-sm">
        연도를 선택하여 Recap을 시작하세요
      </div>
    </div>
  )
}
