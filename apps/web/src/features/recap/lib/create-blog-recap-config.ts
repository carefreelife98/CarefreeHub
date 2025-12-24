import type { RecapConfig, SlideConfig } from "../model/types"
import { getBlogRecapStats } from "./get-recap-stats"

// 슬라이드 컴포넌트들 (동적 import를 위해 string으로 참조)
import { IntroSlide } from "../ui/slides/IntroSlide"
import { StatsSlide } from "../ui/slides/StatsSlide"
import { ChartSlide } from "../ui/slides/ChartSlide"
import { HighlightSlide } from "../ui/slides/HighlightSlide"
import { OutroSlide } from "../ui/slides/OutroSlide"

import type {
  IntroSlideData,
  StatsSlideData,
  ChartSlideData,
  HighlightSlideData,
  OutroSlideData,
} from "../model/types"

/**
 * 블로그 Recap 설정 생성
 * 연도별 블로그 통계를 기반으로 슬라이드 구성
 */
export function createBlogRecapConfig(year: number): RecapConfig {
  const stats = getBlogRecapStats(year)

  const slides: SlideConfig<unknown>[] = []

  // 1. 인트로 슬라이드
  slides.push({
    id: "intro",
    component: IntroSlide,
    data: {
      year,
      title: `${year}년, 나의 기록`,
      subtitle: "올 한 해를 돌아봅니다",
    } satisfies IntroSlideData,
    background: {
      type: "gradient",
      gradient: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)",
    },
    animation: {
      enter: "fade",
      duration: 0.8,
      stagger: true,
      staggerDelay: 0.2,
    },
  })

  // 2. 총 포스트 수 통계
  slides.push({
    id: "total-stats",
    component: StatsSlide,
    data: {
      title: "올해의 기록",
      stats: [
        { label: "작성한 글", value: stats.totalPosts, suffix: "개", highlight: true },
        { label: "총 단어 수", value: stats.totalWords.toLocaleString(), suffix: "자" },
        { label: "읽는 시간", value: stats.totalReadingTime, suffix: "분" },
      ],
    } satisfies StatsSlideData,
    background: {
      type: "gradient",
      gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    },
    animation: {
      enter: "slide-up",
      duration: 0.6,
      stagger: true,
      staggerDelay: 0.15,
    },
  })

  // 3. 카테고리 분포 차트
  if (stats.categoryBreakdown.length > 0) {
    slides.push({
      id: "category-chart",
      component: ChartSlide,
      data: {
        title: "어떤 주제로 글을 썼을까?",
        subtitle: "카테고리별 포스트 분포",
        chartType: "bar",
        data: stats.categoryBreakdown.map((cat) => ({
          name: cat.category,
          value: cat.count,
          color: cat.color?.includes("emerald")
            ? "#10b981"
            : cat.color?.includes("blue")
              ? "#3b82f6"
              : cat.color?.includes("violet")
                ? "#8b5cf6"
                : cat.color?.includes("amber")
                  ? "#f59e0b"
                  : cat.color?.includes("rose")
                    ? "#f43f5e"
                    : "#6b7280",
        })),
      } satisfies ChartSlideData,
      background: {
        type: "gradient",
        gradient: "linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)",
      },
      animation: {
        enter: "slide-up",
        duration: 0.6,
      },
    })
  }

  // 4. 월별 활동 차트
  const activeMonths = stats.monthlyActivity.filter((m) => m.postCount > 0)
  if (activeMonths.length > 0) {
    slides.push({
      id: "monthly-chart",
      component: ChartSlide,
      data: {
        title: "언제 가장 열심히 썼을까?",
        subtitle: "월별 포스트 활동",
        chartType: "bar",
        data: stats.monthlyActivity.map((m) => ({
          name: m.monthName,
          value: m.postCount,
          color: m.postCount > 0 ? "#3b82f6" : "#374151",
        })),
      } satisfies ChartSlideData,
      background: {
        type: "gradient",
        gradient: "linear-gradient(135deg, #1a1a2e 0%, #0f172a 100%)",
      },
      animation: {
        enter: "slide-up",
        duration: 0.6,
      },
    })
  }

  // 5. 인기 태그
  if (stats.topTags.length > 0) {
    slides.push({
      id: "top-tags",
      component: StatsSlide,
      data: {
        title: "자주 사용한 태그",
        stats: stats.topTags.slice(0, 5).map((tag, i) => ({
          label: `#${tag.tag}`,
          value: tag.count,
          suffix: "회",
          highlight: i === 0,
        })),
      } satisfies StatsSlideData,
      background: {
        type: "gradient",
        gradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
      },
      animation: {
        enter: "slide-up",
        duration: 0.6,
        stagger: true,
        staggerDelay: 0.1,
      },
    })
  }

  // 6. 하이라이트 포스트
  const highlightItems = []
  if (stats.highlights.firstPost) {
    highlightItems.push({
      label: "첫 번째 글",
      title: stats.highlights.firstPost.title,
      description: stats.highlights.firstPost.description,
      link: `/posts/${stats.highlights.firstPost.slug}`,
      meta: new Date(stats.highlights.firstPost.date).toLocaleDateString("ko-KR"),
    })
  }
  if (stats.highlights.longestPost) {
    highlightItems.push({
      label: "가장 긴 글",
      title: stats.highlights.longestPost.title,
      description: `${stats.highlights.longestPost.wordCount?.toLocaleString()}자`,
      link: `/posts/${stats.highlights.longestPost.slug}`,
    })
  }
  if (
    stats.highlights.latestPost &&
    stats.highlights.latestPost.slug !== stats.highlights.firstPost?.slug
  ) {
    highlightItems.push({
      label: "마지막 글",
      title: stats.highlights.latestPost.title,
      description: stats.highlights.latestPost.description,
      link: `/posts/${stats.highlights.latestPost.slug}`,
      meta: new Date(stats.highlights.latestPost.date).toLocaleDateString("ko-KR"),
    })
  }

  if (highlightItems.length > 0) {
    slides.push({
      id: "highlights",
      component: HighlightSlide,
      data: {
        title: "올해의 하이라이트",
        items: highlightItems,
      } satisfies HighlightSlideData,
      background: {
        type: "gradient",
        gradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
      },
      animation: {
        enter: "slide-up",
        duration: 0.6,
        stagger: true,
        staggerDelay: 0.15,
      },
    })
  }

  // 7. 아웃트로
  slides.push({
    id: "outro",
    component: OutroSlide,
    data: {
      title: "수고하셨습니다!",
      subtitle: `${year}년 한 해 동안 ${stats.totalPosts}개의 글을 작성했어요`,
      message: "내년에도 함께해요 ✨",
      showShareButton: true,
    } satisfies OutroSlideData,
    background: {
      type: "gradient",
      gradient: "linear-gradient(135deg, #312e81 0%, #1e1b4b 50%, #0f0f0f 100%)",
    },
    animation: {
      enter: "fade",
      duration: 1,
      stagger: true,
      staggerDelay: 0.3,
    },
  })

  return {
    id: `blog-recap-${year}`,
    title: `${year} Recap`,
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
