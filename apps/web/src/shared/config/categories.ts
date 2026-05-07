import {
  LucideIcon,
  Server,
  Briefcase,
  BookOpen,
  Folder,
  Megaphone,
  ScrollText,
} from "lucide-react"

/**
 * 카테고리 노드 타입
 * - name: 표시 이름
 * - slug: URL에 사용될 식별자 (소문자, kebab-case)
 * - icon: Lucide 아이콘 (선택)
 * - color: 칩 색상 클래스 (선택)
 * - description: 카테고리 설명 (선택)
 * - children: 하위 카테고리 (선택)
 */
export interface CategoryNode {
  name: string
  slug: string
  icon?: LucideIcon
  color?: string
  description?: string
  children?: CategoryNode[]
}

/**
 * 카테고리 트리 설정
 *
 * 사용법:
 * 1. frontmatter에는 최하위 카테고리 slug만 작성
 *    예: categories: ["react", "nestjs"]
 *
 * 2. 새 카테고리 추가 시 이 트리에 추가
 *    - 부모 카테고리: children 배열에 자식 추가
 *    - 최상위 카테고리: categoryTree 배열에 추가
 *
 * 3. 라우팅: /posts/category/[slug]
 */
/*
 * 카테고리 컬러 시스템 — Warm Ink 팔레트
 *
 * 원칙:
 * - 같은 부모 = 같은 hue (자식은 lightness 단계만 다르게)
 * - 5개 패밀리: ink (Tech), coral (Project), amber (Learning), sage (Seminar), parchment (Recap)
 * - 모든 색상은 토큰 무관한 OKLCH로 정의 (테마 토큰과 충돌하지 않음)
 * - 칩 형태: bg + text — 본문 위 부드러운 wash
 *
 * 다크모드는 dark: 변형으로 lightness/chroma 조정.
 */
const C = {
  // Tech — 잉크 블루 패밀리
  tech: "bg-[oklch(0.94_0.04_250)] text-[oklch(0.42_0.16_250)] dark:bg-[oklch(0.3_0.06_250)] dark:text-[oklch(0.78_0.13_250)]",
  techStrong:
    "bg-[oklch(0.92_0.05_250)] text-[oklch(0.4_0.17_250)] dark:bg-[oklch(0.32_0.07_250)] dark:text-[oklch(0.8_0.14_250)]",

  // Project — 따뜻한 코랄 패밀리
  project:
    "bg-[oklch(0.94_0.04_25)] text-[oklch(0.5_0.17_25)] dark:bg-[oklch(0.3_0.06_25)] dark:text-[oklch(0.78_0.14_25)]",
  projectStrong:
    "bg-[oklch(0.92_0.05_25)] text-[oklch(0.48_0.18_25)] dark:bg-[oklch(0.32_0.07_25)] dark:text-[oklch(0.8_0.15_25)]",

  // Learning — 앰버 패밀리
  learning:
    "bg-[oklch(0.93_0.05_75)] text-[oklch(0.5_0.13_75)] dark:bg-[oklch(0.3_0.05_75)] dark:text-[oklch(0.82_0.13_75)]",

  // Seminar — 세이지 패밀리
  seminar:
    "bg-[oklch(0.93_0.04_160)] text-[oklch(0.45_0.12_160)] dark:bg-[oklch(0.3_0.05_160)] dark:text-[oklch(0.78_0.12_160)]",

  // Recap — 파치먼트(짙은 따뜻 톤)
  recap:
    "bg-[oklch(0.93_0.03_60)] text-[oklch(0.4_0.04_60)] dark:bg-[oklch(0.28_0.02_60)] dark:text-[oklch(0.85_0.02_60)]",
} as const

export const categoryTree: CategoryNode[] = [
  {
    name: "Tech",
    slug: "tech",
    icon: Server,
    color: C.tech,
    description: "개발 기술, 아키텍처, 트러블슈팅 등 기술 포스팅",
    children: [
      {
        name: "Backend",
        slug: "backend",
        icon: Server,
        color: C.tech,
        children: [
          { name: "Spring", slug: "spring", color: C.tech },
          { name: "NestJS", slug: "nestjs", color: C.techStrong },
        ],
      },
    ],
  },
  {
    name: "Project",
    slug: "project",
    icon: Briefcase,
    color: C.project,
    description: "사이드 프로젝트 개발 과정 및 회고",
    children: [
      {
        name: "Toy",
        slug: "toy",
        color: C.project,
        children: [{ name: "Carefree OCR", slug: "carefree-ocr", color: C.projectStrong }],
      },
      {
        name: "Task",
        slug: "task",
        color: C.project,
        children: [
          { name: "FLOKR", slug: "flokr", color: C.projectStrong },
          { name: "FLOWIKI", slug: "flowiki", color: C.projectStrong },
        ],
      },
    ],
  },
  {
    name: "Learning",
    slug: "learning",
    icon: BookOpen,
    color: C.learning,
    description: "교육 과정, 자격증 준비 등 학습 기록",
    children: [{ name: "CloudWave", slug: "cloudwave", color: C.learning }],
  },
  {
    name: "Seminar",
    slug: "seminar",
    icon: Megaphone,
    color: C.seminar,
    description: "세미나 후기 및 관련 정보",
    children: [{ name: "Goorm", slug: "goorm", color: C.seminar }],
  },
  {
    name: "Recap",
    slug: "recap",
    icon: ScrollText,
    color: C.recap,
    description: "회고",
    children: [{ name: "2025", slug: "2025", color: C.recap }],
  },
]

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 모든 카테고리 slug를 flat하게 반환
 */
export function getAllCategorySlugs(): string[] {
  const slugs: string[] = []

  function traverse(nodes: CategoryNode[]) {
    for (const node of nodes) {
      slugs.push(node.slug)
      if (node.children) {
        traverse(node.children)
      }
    }
  }

  traverse(categoryTree)
  return slugs
}

/**
 * slug로 카테고리 노드 찾기
 */
export function findCategoryBySlug(slug: string): CategoryNode | null {
  function traverse(nodes: CategoryNode[]): CategoryNode | null {
    for (const node of nodes) {
      if (node.slug === slug) return node
      if (node.children) {
        const found = traverse(node.children)
        if (found) return found
      }
    }
    return null
  }

  return traverse(categoryTree)
}

/**
 * slug의 부모 카테고리들 찾기 (breadcrumb용)
 */
export function getCategoryPath(slug: string): CategoryNode[] {
  const path: CategoryNode[] = []

  function traverse(nodes: CategoryNode[], currentPath: CategoryNode[]): boolean {
    for (const node of nodes) {
      const newPath = [...currentPath, node]
      if (node.slug === slug) {
        path.push(...newPath)
        return true
      }
      if (node.children && traverse(node.children, newPath)) {
        return true
      }
    }
    return false
  }

  traverse(categoryTree, [])
  return path
}

/**
 * 특정 카테고리와 모든 하위 카테고리 slug 반환
 */
export function getCategoryWithDescendants(slug: string): string[] {
  const category = findCategoryBySlug(slug)
  if (!category) return []

  const slugs: string[] = [category.slug]

  function collectChildren(node: CategoryNode) {
    if (node.children) {
      for (const child of node.children) {
        slugs.push(child.slug)
        collectChildren(child)
      }
    }
  }

  collectChildren(category)
  return slugs
}

/**
 * 카테고리 기본 아이콘 반환
 */
export function getCategoryIcon(slug: string): LucideIcon {
  const category = findCategoryBySlug(slug)
  if (category?.icon) return category.icon

  // 부모 카테고리에서 아이콘 상속
  const path = getCategoryPath(slug)
  for (let i = path.length - 1; i >= 0; i--) {
    const icon = path[i].icon
    if (icon) return icon
  }

  return Folder
}

/**
 * 카테고리 색상 반환
 */
export function getCategoryColor(slug: string): string | undefined {
  const category = findCategoryBySlug(slug)
  if (category?.color) return category.color

  // 부모 카테고리에서 색상 상속
  const path = getCategoryPath(slug)
  for (let i = path.length - 1; i >= 0; i--) {
    const color = path[i].color
    if (color) return color
  }

  return undefined
}
