import type { RecapConfig, SlideConfig } from "../../model/types"
import { IntroSlide } from "../../ui/slides/IntroSlide"
import { StatsSlide } from "../../ui/slides/StatsSlide"
import { HighlightSlide } from "../../ui/slides/HighlightSlide"
import { OutroSlide } from "../../ui/slides/OutroSlide"
import { CustomSlide } from "../../ui/slides/CustomSlide"

import type {
  IntroSlideData,
  StatsSlideData,
  HighlightSlideData,
  OutroSlideData,
  CustomSlideData,
} from "../../model/types"

import { createElement } from "react"

/**
 * 2025년 개인 회고 Recap 설정 생성
 * road_to_carefree_life_2025.mdx 내용 기반
 */
export function create2025RecapConfig(): RecapConfig {
  const slides: SlideConfig<unknown>[] = []

  // 1. 인트로
  slides.push({
    id: "intro",
    component: IntroSlide,
    data: {
      year: 2025,
      title: "Good bye 2025 !",
      subtitle: "불확실한 문제를 구조로 정의하고, 그 구조를 실제 코드로 증명한 1년",
    } satisfies IntroSlideData,
    background: {
      type: "gradient",
      gradient: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)",
    },
    theme: "dark",
    animation: {
      enter: "fade",
      duration: 0.8,
      stagger: true,
      staggerDelay: 0.2,
    },
  })

  // 2. 나는 어떤 사람이었는가
  slides.push({
    id: "who-i-was",
    component: CustomSlide,
    data: {
      title: "나는 어떤 사람이었는가",
      content: createElement(
        "div",
        { className: "flex flex-col gap-6 text-left w-full" },
        createElement(
          "div",
          { className: "p-5 rounded-xl bg-white/5 border border-white/10" },
          createElement("span", { className: "text-white/40 text-sm tracking-wider" }, "아들로서"),
          createElement(
            "p",
            { className: "text-white/80 text-base md:text-lg mt-2 leading-relaxed" },
            "부모님께 받아온 무조건적인 사랑에 무조건적인 사랑으로 답하고 있는 듬직한 아들"
          )
        ),
        createElement(
          "div",
          { className: "p-5 rounded-xl bg-white/5 border border-white/10" },
          createElement("span", { className: "text-white/40 text-sm tracking-wider" }, "동료로서"),
          createElement(
            "p",
            { className: "text-white/80 text-base md:text-lg mt-2 leading-relaxed" },
            '"커뮤니케이션에 비용이 들지 않는 유일한 동료"'
          )
        ),
        createElement(
          "div",
          { className: "p-5 rounded-xl bg-white/5 border border-white/10" },
          createElement(
            "span",
            { className: "text-white/40 text-sm tracking-wider" },
            "남자친구로서"
          ),
          createElement(
            "p",
            { className: "text-white/80 text-base md:text-lg mt-2 leading-relaxed" },
            "배울 수 있는, 좋은 영향을 줄 수 있는 사람"
          )
        )
      ),
    } satisfies CustomSlideData,
    background: {
      type: "gradient",
      gradient: "linear-gradient(180deg, #1a1a2e 0%, #0f172a 100%)",
    },
    theme: "dark",
    animation: {
      enter: "slide-up",
      duration: 0.6,
      stagger: true,
      staggerDelay: 0.15,
    },
  })

  // 3. 올해 나는 어떤 개발자였는가
  slides.push({
    id: "developer-identity",
    component: CustomSlide,
    data: {
      title: "올해 나는 어떤 개발자였는가",
      content: createElement(
        "div",
        { className: "flex flex-col items-center gap-8 w-full" },
        createElement(
          "p",
          { className: "text-white/70 text-base md:text-lg leading-relaxed text-center" },
          "불확실한 문제를 외면하지 않고 끝까지 파고들며,",
          createElement("br"),
          '"지금 가장 합리적인 구조는 무엇인가" 를 고민하는 개발자로 성장한 한 해.'
        ),
        createElement(
          "blockquote",
          {
            className: "text-xl md:text-2xl font-semibold text-center leading-relaxed",
            style: {
              background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            },
          },
          '"불확실한 문제를 구조로 정의하고,',
          createElement("br"),
          '그 구조를 실제 코드로 증명하는 개발자"'
        )
      ),
    } satisfies CustomSlideData,
    background: {
      type: "gradient",
      gradient: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)",
    },
    theme: "dark",
    animation: {
      enter: "fade",
      duration: 0.8,
      stagger: true,
      staggerDelay: 0.2,
    },
  })

  // 4. 올해를 관통하는 핵심 테마 3가지
  slides.push({
    id: "core-themes",
    component: StatsSlide,
    data: {
      title: "올해를 관통하는 핵심 테마",
      stats: [
        {
          label: "정답이 없는 문제를 구조화",
          value: "구조화",
          highlight: true,
        },
        {
          label: "빠르게 검증하고 깊게 들어간다",
          value: "검증",
        },
        {
          label: "코드를 자산으로 만들다",
          value: "자산",
        },
      ],
    } satisfies StatsSlideData,
    background: {
      type: "gradient",
      gradient: "linear-gradient(180deg, #1e1b4b 0%, #fafafa 30%, #fafafa 100%)",
    },
    theme: "light",
    animation: {
      enter: "slide-up",
      duration: 0.6,
      stagger: true,
      staggerDelay: 0.15,
    },
  })

  // 5. 올해 수행한 프로젝트
  slides.push({
    id: "projects",
    component: HighlightSlide,
    data: {
      title: "올해 수행한 프로젝트",
      items: [
        {
          label: "FLOKR",
          title: "대기업 보험사 OKR 성과 관리 시스템",
          description: "백엔드 전체 설계 + d3.js OKR Map 시각화",
          link: "/posts/flokr",
        },
        {
          label: "FLOWIKI",
          title: "사내 위키 및 실시간 협업 문서 시스템",
          description: "프론트 아키텍처 + PostgreSQL Full Text Search",
        },
        {
          label: "flow AI",
          title: "AI 에이전트 기반 협업 서비스",
          description: "기획부터 설계·개발까지 End-to-End",
          // link: "/posts/road-to-carefree-life-2025",
        },
      ],
    } satisfies HighlightSlideData,
    background: {
      type: "solid",
      color: "#fafafa",
    },
    theme: "light",
    animation: {
      enter: "slide-up",
      duration: 0.6,
      stagger: true,
      staggerDelay: 0.15,
    },
  })

  // 6. flow AI 여정 타임라인
  slides.push({
    id: "flow-ai-journey",
    component: CustomSlide,
    data: {
      title: "flow AI — 8개월의 여정",
      content: createElement(
        "div",
        { className: "flex flex-col gap-3 text-left w-full" },
        ...[
          { month: "6월", event: "AI TFT 시작, 첫 커밋", icon: "🚀" },
          { month: "7월", event: "LangChain 학습, Tool Calling 첫 구현", icon: "📚" },
          { month: "8월", event: "RAG 파이프라인 구축, 출처 하이라이팅", icon: "🔍" },
          { month: "9월", event: "299커밋, GeneralChatWorkflow 구현", icon: "🔥" },
          { month: "10월", event: "CPU 위기 → 하이브리드 렌더링 해결", icon: "⚡" },
          { month: "11월", event: "아키텍처 전환, Main/Sub Agent 구조", icon: "🏗️" },
          { month: "12-1월", event: "Flow Search 7노드 파이프라인, Deep Think", icon: "🎯" },
          { month: "2월", event: "런칭! 1,692명 활성 사용자", icon: "🎉" },
        ].map((item) =>
          createElement(
            "div",
            {
              key: item.month,
              className: "flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10",
            },
            createElement("span", { className: "text-xl" }, item.icon),
            createElement(
              "div",
              { className: "flex-1 min-w-0" },
              createElement(
                "span",
                { className: "text-white/40 text-xs tracking-wider" },
                item.month
              ),
              createElement(
                "p",
                { className: "text-white/80 text-sm md:text-base truncate" },
                item.event
              )
            )
          )
        )
      ),
    } satisfies CustomSlideData,
    background: {
      type: "gradient",
      gradient: "linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%)",
    },
    theme: "dark",
    animation: {
      enter: "slide-up",
      duration: 0.6,
      stagger: true,
      staggerDelay: 0.1,
    },
  })

  // 7. flow AI 숫자로 돌아보기
  slides.push({
    id: "flow-ai-numbers",
    component: StatsSlide,
    data: {
      title: "숫자로 돌아보는 8개월",
      stats: [
        { label: "총 커밋", value: "1,203", suffix: "개", highlight: true },
        { label: "코드 보유량", value: "64,758", suffix: "줄" },
        { label: "야간 커밋", value: 303, suffix: "건" },
        { label: "월 최고 기록", value: 299, suffix: "커밋" },
      ],
    } satisfies StatsSlideData,
    background: {
      type: "solid",
      color: "#fafafa",
    },
    theme: "light",
    animation: {
      enter: "slide-up",
      duration: 0.6,
      stagger: true,
      staggerDelay: 0.15,
    },
  })

  // 8. 런칭 성과
  slides.push({
    id: "launch-results",
    component: StatsSlide,
    data: {
      title: "오픈 첫 주 성과 (상위 100개 기업)",
      stats: [
        { label: "활성 사용자", value: "1,692", suffix: "명" },
        { label: "총 대화", value: "15,410", suffix: "회", highlight: true },
        { label: "Flow Search 비중", value: "41.8", suffix: "%" },
      ],
    } satisfies StatsSlideData,
    background: {
      type: "solid",
      color: "#fafafa",
    },
    theme: "light",
    animation: {
      enter: "slide-up",
      duration: 0.6,
      stagger: true,
      staggerDelay: 0.15,
    },
  })

  // 9. 배운 것
  slides.push({
    id: "lessons-learned",
    component: CustomSlide,
    data: {
      title: "flow AI를 통해 배운 것",
      content: createElement(
        "div",
        { className: "flex flex-col gap-5 text-left max-w-2xl" },
        createElement(
          "div",
          { className: "p-5 rounded-xl bg-white/5 border border-white/10" },
          createElement(
            "h3",
            {
              className: "text-lg font-semibold mb-2",
              style: {
                background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              },
            },
            "부딪혀보는 용기"
          ),
          createElement(
            "p",
            { className: "text-white/60 text-sm md:text-base leading-relaxed" },
            '"해본 적 없다"는 것이 "할 수 없다"의 이유가 되지 않는다.'
          )
        ),
        createElement(
          "div",
          { className: "p-5 rounded-xl bg-white/5 border border-white/10" },
          createElement(
            "h3",
            {
              className: "text-lg font-semibold mb-2",
              style: {
                background: "linear-gradient(135deg, #34d399 0%, #60a5fa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              },
            },
            "측정 기반 엔지니어링"
          ),
          createElement(
            "p",
            { className: "text-white/60 text-sm md:text-base leading-relaxed" },
            '"작동하는 코드"와 "잘 작동하는 코드" 사이에는 측정과 분석이라는 거대한 간극이 있었다.'
          )
        ),
        createElement(
          "div",
          { className: "p-5 rounded-xl bg-white/5 border border-white/10" },
          createElement(
            "h3",
            {
              className: "text-lg font-semibold mb-2",
              style: {
                background: "linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              },
            },
            "기존 코드를 부수는 결단"
          ),
          createElement(
            "p",
            { className: "text-white/60 text-sm md:text-base leading-relaxed" },
            "완성은 때론 파괴에서 시작된다."
          )
        )
      ),
    } satisfies CustomSlideData,
    background: {
      type: "gradient",
      gradient: "linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%)",
    },
    theme: "dark",
    animation: {
      enter: "slide-up",
      duration: 0.6,
      stagger: true,
      staggerDelay: 0.15,
    },
  })

  // 10. 아웃트로
  slides.push({
    id: "outro",
    component: OutroSlide,
    data: {
      title: "수고했다, 2025.",
      subtitle: "8개월간 AI 에이전트 개발의 기본기를 다졌으니,",
      message: "앞으로는 더 지능적이고, 더 가치 있는 것들을 만들어 나가려 합니다.",
      showShareButton: true,
    } satisfies OutroSlideData,
    background: {
      type: "solid",
      color: "#fafafa",
    },
    theme: "light",
    animation: {
      enter: "fade",
      duration: 1,
      stagger: true,
      staggerDelay: 0.3,
    },
  })

  return {
    id: "general-recap-2025",
    title: "2025 Road to Carefree Life",
    slides,
    theme: {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      background: "#0f0f0f",
      text: "#ffffff",
      accent: "#f59e0b",
    },
  }
}
