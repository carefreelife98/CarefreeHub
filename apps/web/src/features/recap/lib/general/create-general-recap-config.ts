import { IntroSlide, IntroSlideData, RecapConfig, SlideConfig } from "../.."
import { create2025RecapConfig } from "../2025"

export function createGeneralRecapConfig(year: number): RecapConfig {
  // 연도별 전용 config가 있으면 사용
  if (year === 2025) return create2025RecapConfig()

  // 기본 placeholder (다른 연도용)
  const slides: SlideConfig<unknown>[] = []

  slides.push({
    id: "intro",
    component: IntroSlide,
    data: {
      year,
      title: `준비 중 입니다.`,
      subtitle: "준비 중 입니다.",
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
