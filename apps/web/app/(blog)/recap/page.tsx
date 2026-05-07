import Link from "next/link"
import { getAvailableRecapYears } from "@features/recap"
import { ArrowRight, ScrollText } from "lucide-react"

export default function RecapLandingPage() {
  const years = getAvailableRecapYears()
  const currentYear = new Date().getFullYear()
  const hasYears = years.length > 0

  return (
    <div
      className="flex flex-col min-h-[100dvh] px-4 sm:px-8"
      style={{
        paddingTop: "max(2rem, env(safe-area-inset-top))",
        paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
      }}
    >
      {/* 헤더 — 일반 흐름으로 배치하여 노치/짧은 뷰포트와 겹치지 않게 */}
      <header className="shrink-0">
        <Link
          href="/"
          className="inline-flex items-center text-foreground/60 hover:text-foreground transition-colors text-sm py-2 -ml-1 px-1 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60"
        >
          ← 홈으로 돌아가기
        </Link>
      </header>

      {/* 메인 콘텐츠 — 남은 공간에서 중앙 정렬 */}
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="text-center max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-center gap-3 mb-6">
            <ScrollText className="w-7 h-7 sm:w-8 sm:h-8 text-primary" aria-hidden="true" />
            <span className="text-foreground/70 text-base sm:text-lg tracking-widest">RECAP</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-4 sm:mb-6 break-keep"
            style={{ letterSpacing: "-0.025em" }}
          >
            나의 연간 기록
          </h1>

          <p className="text-base sm:text-lg text-foreground/60 mb-10 sm:mb-12 break-keep">
            한 해 동안의 활동을 돌아보세요
          </p>

          {hasYears ? (
            <ul
              className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto list-none p-0"
              aria-label="연도 선택"
            >
              {years.map((year) => (
                <li key={year}>
                  <Link
                    href={`/recap/${year}`}
                    className="group relative block p-5 sm:p-6 rounded-2xl bg-foreground/5 border border-foreground/10
                      hover:bg-foreground/10 hover:border-foreground/20 transition-all duration-300
                      motion-reduce:transition-none
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60"
                    aria-label={`${year}년 Recap 보기`}
                  >
                    <span className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors motion-reduce:transition-none tabular-nums">
                      {year}
                    </span>
                    <ArrowRight
                      className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-4 h-4 sm:w-5 sm:h-5 text-foreground/30
                        group-hover:text-foreground/60 group-hover:translate-x-1 transition-all duration-300
                        motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                      aria-hidden="true"
                    />
                    {year === currentYear && (
                      <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 text-[10px] sm:text-xs bg-primary/20 text-primary rounded-full">
                        올해
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="max-w-lg mx-auto py-10 sm:py-12 text-foreground/60 rounded-2xl border border-foreground/10 bg-foreground/5 px-6">
              <p className="mb-3">아직 작성된 포스트가 없습니다</p>
              <Link
                href="/posts"
                className="text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors inline-block"
              >
                첫 번째 글 작성하기 →
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* 푸터 힌트 — flex 흐름의 끝, 짧은 viewport에서도 콘텐츠와 겹치지 않음 */}
      <footer className="shrink-0 text-center pt-6">
        <p className="text-foreground/40 text-xs sm:text-sm">
          {hasYears ? "연도를 선택하여 Recap을 시작하세요" : "Recap은 한 해의 글이 모이면 열립니다"}
        </p>
      </footer>
    </div>
  )
}
