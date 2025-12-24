import { ComponentType, ReactNode } from "react"

// ============================================
// 슬라이드 시스템 추상화
// ============================================

/**
 * 애니메이션 설정
 */
export interface AnimationConfig {
  /** 등장 애니메이션 타입 */
  enter?: "fade" | "slide-up" | "slide-left" | "scale" | "none"
  /** 퇴장 애니메이션 타입 */
  exit?: "fade" | "slide-down" | "slide-right" | "scale" | "none"
  /** 애니메이션 지속 시간 (초) */
  duration?: number
  /** 애니메이션 딜레이 (초) */
  delay?: number
  /** stagger 효과 적용 여부 */
  stagger?: boolean
  /** stagger 딜레이 (초) */
  staggerDelay?: number
}

/**
 * 배경 설정
 */
export interface BackgroundConfig {
  /** 배경 타입 */
  type: "solid" | "gradient" | "image" | "pattern"
  /** 단색 배경 */
  color?: string
  /** 그라데이션 (CSS gradient string) */
  gradient?: string
  /** 이미지 URL */
  imageUrl?: string
  /** 오버레이 색상 */
  overlay?: string
}

/**
 * 슬라이드 기본 Props
 * 모든 슬라이드 컴포넌트는 이 props를 받습니다.
 */
export interface BaseSlideProps<T = unknown> {
  /** 슬라이드 데이터 */
  data: T
  /** 현재 활성화 상태 */
  isActive: boolean
  /** 슬라이드 인덱스 */
  index: number
  /** 총 슬라이드 수 */
  totalSlides: number
  /** 다음 슬라이드로 이동 */
  onNext?: () => void
  /** 이전 슬라이드로 이동 */
  onPrev?: () => void
  /** 특정 슬라이드로 이동 */
  onGoTo?: (index: number) => void
}

/**
 * 슬라이드 설정
 * 원하는 슬라이드를 원하는 위치에 배치할 수 있습니다.
 */
export interface SlideConfig<T = unknown> {
  /** 슬라이드 고유 ID */
  id: string
  /** 슬라이드 컴포넌트 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<BaseSlideProps<any>>
  /** 슬라이드에 전달할 데이터 */
  data: T
  /** 애니메이션 설정 (선택) */
  animation?: AnimationConfig
  /** 배경 설정 (선택) */
  background?: BackgroundConfig
}

/**
 * Recap 테마 설정
 */
export interface RecapTheme {
  /** 주요 색상 */
  primary: string
  /** 보조 색상 */
  secondary: string
  /** 배경 색상 */
  background: string
  /** 텍스트 색상 */
  text: string
  /** 강조 텍스트 색상 */
  accent: string
}

/**
 * Recap 전체 설정
 * 이 설정으로 원하는 Recap 화면을 구성할 수 있습니다.
 */
export interface RecapConfig {
  /** 연도 또는 기간 식별자 */
  id: string
  /** Recap 제목 */
  title: string
  /** 슬라이드 배열 (순서대로 표시) */
  slides: SlideConfig<unknown>[]
  /** 테마 설정 (선택) */
  theme?: Partial<RecapTheme>
  /** 자동 재생 여부 */
  autoPlay?: boolean
  /** 자동 재생 간격 (초) */
  autoPlayInterval?: number
}

// ============================================
// 블로그 Recap 통계 타입
// ============================================

/**
 * 카테고리 분포 데이터
 */
export interface CategoryBreakdown {
  category: string
  slug: string
  count: number
  percentage: number
  color?: string
}

/**
 * 월별 활동 데이터
 */
export interface MonthlyActivity {
  month: number
  monthName: string
  postCount: number
}

/**
 * 태그 통계
 */
export interface TagStat {
  tag: string
  count: number
}

/**
 * 포스트 하이라이트
 */
export interface PostHighlight {
  title: string
  slug: string
  date: string
  description?: string
  category?: string
  readingTime?: number
  wordCount?: number
}

/**
 * 블로그 Recap 통계
 */
export interface BlogRecapStats {
  year: number

  // 총계
  totalPosts: number
  totalWords: number
  totalReadingTime: number

  // 분포
  categoryBreakdown: CategoryBreakdown[]
  monthlyActivity: MonthlyActivity[]
  topTags: TagStat[]

  // 하이라이트
  highlights: {
    firstPost?: PostHighlight
    latestPost?: PostHighlight
    longestPost?: PostHighlight
    mostTags?: PostHighlight
  }

  // 연속 작성
  streaks?: {
    longest: number
    current: number
  }
}

// ============================================
// 슬라이드별 데이터 타입
// ============================================

/**
 * 인트로 슬라이드 데이터
 */
export interface IntroSlideData {
  year: number
  title: string
  subtitle?: string
}

/**
 * 통계 카드 슬라이드 데이터
 */
export interface StatsSlideData {
  title: string
  stats: {
    label: string
    value: number | string
    suffix?: string
    prefix?: string
    highlight?: boolean
  }[]
}

/**
 * 차트 슬라이드 데이터
 */
export interface ChartSlideData {
  title: string
  subtitle?: string
  chartType: "bar" | "pie" | "line" | "area"
  data: {
    name: string
    value: number
    color?: string
  }[]
}

/**
 * 하이라이트 슬라이드 데이터
 */
export interface HighlightSlideData {
  title: string
  items: {
    label: string
    title: string
    description?: string
    link?: string
    meta?: string
  }[]
}

/**
 * 커스텀 콘텐츠 슬라이드 데이터
 */
export interface CustomSlideData {
  title?: string
  content: ReactNode
}

/**
 * 아웃트로 슬라이드 데이터
 */
export interface OutroSlideData {
  title: string
  subtitle?: string
  message?: string
  showShareButton?: boolean
}
