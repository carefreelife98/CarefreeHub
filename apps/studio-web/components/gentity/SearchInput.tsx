"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { ModelSelector, useBuildityModel } from "@/components/buildity/ModelSelector"
import { analyzeGame, suggestKeywords } from "@/lib/api/gentity"
import { Loader as LoaderIcon, Sparkles as SparklesIcon } from "lucide-react"

type GameGenre = "casual" | "simulation" | "arcade" | "puzzle" | "action" | "strategy" | "rpg"

const GENRE_LABELS: Record<GameGenre, string> = {
  casual: "캐주얼",
  simulation: "시뮬레이션",
  arcade: "아케이드",
  puzzle: "퍼즐",
  action: "액션",
  strategy: "전략",
  rpg: "RPG",
}

interface Suggestion {
  keyword: string
  genre: string
  description: string
}

export function SearchInput() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [genre, setGenre] = useState<GameGenre | undefined>(undefined)
  const [maxCompetitors, setMaxCompetitors] = useState(15)
  const [reviewsPerApp, setReviewsPerApp] = useState(200)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { llmConfig, setModel } = useBuildityModel()

  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSuggestLoading, setIsSuggestLoading] = useState(false)
  const suggestRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showSuggestions) return
    const handler = (e: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [showSuggestions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const { analysisId } = await analyzeGame({
        query: query.trim(),
        genre,
        maxCompetitors,
        reviewsPerApp,
        llm: llmConfig,
      })
      router.push(
        `/gentity/${analysisId}?provider=${llmConfig.provider}&model=${encodeURIComponent(llmConfig.model)}`
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "분석 시작 실패")
      setIsLoading(false)
    }
  }

  const handleSuggest = async () => {
    if (isSuggestLoading) return
    if (suggestions.length > 0) {
      setShowSuggestions(true)
      return
    }
    setIsSuggestLoading(true)
    setShowSuggestions(true)

    try {
      const result = await suggestKeywords()
      setSuggestions(result)
    } catch {
      setSuggestions([])
    } finally {
      setIsSuggestLoading(false)
    }
  }

  const applySuggestion = (s: Suggestion) => {
    setQuery(s.keyword)
    if (s.genre && s.genre in GENRE_LABELS) {
      setGenre(s.genre as GameGenre)
    }
    setShowSuggestions(false)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
      {/* Keyword input + Sparkles */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          게임 키워드
        </label>
        <div ref={suggestRef} className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: idle restaurant, merge puzzle, hyper casual runner"
            className="h-12 rounded-xl text-base px-4 pr-12 border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleSuggest}
            disabled={isSuggestLoading || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all disabled:opacity-50"
            title="AI 트렌드 키워드 추천"
            aria-label="AI 트렌드 키워드 추천"
          >
            {isSuggestLoading ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <SparklesIcon className="size-4" />
            )}
          </button>

          {/* Suggestions dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-xs font-medium text-muted-foreground">🔥 트렌드 키워드 추천</p>
              </div>
              {isSuggestLoading ? (
                <div className="p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <LoaderIcon className="size-4 animate-spin" />
                  AI가 트렌드를 분석하고 있습니다...
                </div>
              ) : suggestions.length > 0 ? (
                <div>
                  {suggestions.map((s) => (
                    <button
                      key={s.keyword}
                      type="button"
                      onClick={() => applySuggestion(s)}
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.keyword}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                      </div>
                      <span className="text-[10px] font-medium text-primary bg-primary/10 rounded px-1.5 py-0.5 flex-shrink-0 ml-2">
                        {GENRE_LABELS[s.genre as GameGenre] ?? s.genre}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="p-4 text-sm text-muted-foreground text-center">
                  추천 결과가 없습니다
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowSuggestions(false)}
                className="w-full px-3 py-2 text-xs text-muted-foreground hover:bg-muted/50 border-t border-border"
              >
                닫기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Genre filter */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          장르 (선택)
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(GENRE_LABELS) as [GameGenre, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={genre === key}
              onClick={() => setGenre(genre === key ? undefined : key)}
              className={`h-8 px-4 text-xs font-medium rounded-lg transition-all ${
                genre === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Analysis options — number inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            최대 경쟁작 수
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={maxCompetitors}
            onChange={(e) =>
              setMaxCompetitors(Math.min(50, Math.max(1, Number(e.target.value) || 1)))
            }
            className="w-full h-10 rounded-lg border border-border bg-card text-sm px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            앱당 리뷰 수
          </label>
          <input
            type="number"
            min={10}
            max={1000}
            step={10}
            value={reviewsPerApp}
            onChange={(e) =>
              setReviewsPerApp(Math.min(1000, Math.max(10, Number(e.target.value) || 10)))
            }
            className="w-full h-10 rounded-lg border border-border bg-card text-sm px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Model selector */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          분석 모델
        </span>
        <ModelSelector llmConfig={llmConfig} setModel={setModel} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!query.trim() || isLoading}
        className="w-full bg-primary text-primary-foreground rounded-xl h-12 px-8 font-display font-bold text-base shadow-sm hover:shadow-md hover:brightness-110 transition-all disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <LoaderIcon className="h-4 w-4 animate-spin" />
            분석 시작 중...
          </span>
        ) : (
          "분석 시작"
        )}
      </button>
    </form>
  )
}
