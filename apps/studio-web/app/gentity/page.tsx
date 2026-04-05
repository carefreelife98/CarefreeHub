import { SearchInput } from "@/components/gentity/SearchInput"

export default function GentityPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-black tracking-tight text-foreground mb-2">
          <span className="text-gentity">GENTITY</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          게임 키워드를 입력하면 경쟁작 분석 + AI 컨셉 생성을 자동으로 수행합니다
        </p>
      </div>
      <SearchInput />
    </div>
  )
}
