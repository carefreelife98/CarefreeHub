import Link from "next/link"
import { SearchIcon, HammerIcon, ArrowRightIcon } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--color-gentity-glow),transparent)]">
      <div className="mb-16 text-center">
        <h1 className="font-display text-4xl font-black tracking-tight text-foreground mb-3">
          CAREFREE <span className="text-primary">STUDIO</span>
        </h1>
        <p className="text-lg text-muted-foreground mt-3">
          AI 기반 게임 컨셉 생성 및 PRD 빌드 플랫폼
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 w-full max-w-3xl">
        {/* Gentity Card */}
        <Link href="/gentity" className="group block">
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gentity/30 hover:shadow-gentity-glow">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
              <SearchIcon className="size-5 text-gentity" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground group-hover:text-gentity transition-colors">
              GENTITY
            </h2>
            <p className="text-xs text-muted-foreground/60 font-mono mt-1">Generate + Identity</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              게임 장르/키워드를 입력하면 경쟁작을 자동 수집하고, 유저 리뷰를 AI로 분석하여 차별화된
              게임 컨셉을 생성합니다.
            </p>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-gentity text-sm font-medium">분석 시작</span>
              <ArrowRightIcon className="size-4 text-gentity opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </div>
          </div>
        </Link>

        {/* Buildity Card */}
        <Link href="/buildity" className="group block">
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-buildity/30 hover:shadow-buildity-glow">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
              <HammerIcon className="size-5 text-buildity" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground group-hover:text-buildity transition-colors">
              BUILDITY
            </h2>
            <p className="text-xs text-muted-foreground/60 font-mono mt-1">Build + Identity</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              게임 컨셉을 기반으로 6단계 Chip 위저드를 통해 단계적으로 PRD를 구체화하고 마크다운으로
              내보냅니다.
            </p>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-buildity text-sm font-medium">PRD 만들기</span>
              <ArrowRightIcon className="size-4 text-buildity opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
