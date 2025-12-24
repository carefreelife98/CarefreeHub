import { IntroSlide, IntroSlideData, RecapConfig, SlideConfig } from "../.."

export function createGeneralRecapConfig(year: number): RecapConfig {
  const slides: SlideConfig<unknown>[] = []

  // 1. 인트로 슬라이드 (어두운 배경)
  slides.push({
    id: "intro",
    component: IntroSlide,
    data: {
      year,
      title: `준비 중 입니다.`,
      // title: `${year}년, 나의 기록`,
      subtitle: "준비 중 입니다.",
      // subtitle: "올 한 해를 돌아봅니다",
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

  return {
    id: `general-recap-${year}`,
    title: `${year} Carefreelife98 Recap`,
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
