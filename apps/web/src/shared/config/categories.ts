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
export const categoryTree: CategoryNode[] = [
  {
    name: "Tech",
    slug: "tech",
    icon: Server,
    color: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    description: "개발 기술, 아키텍처, 트러블슈팅 등 기술 포스팅",
    children: [
      {
        name: "Backend",
        slug: "backend",
        icon: Server,
        color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        children: [
          {
            name: "Spring",
            slug: "spring",
            color: "bg-green-500/15 text-green-600 dark:text-green-400",
          },
          {
            name: "NestJS",
            slug: "nestjs",
            color: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
          },
        ],
      },
    ],
  },
  {
    name: "Project",
    slug: "project",
    icon: Briefcase,
    color: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    description: "사이드 프로젝트 개발 과정 및 회고",
    children: [
      {
        name: "Carefree OCR",
        slug: "carefree-ocr",
        color: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
      },
    ],
  },
  {
    name: "Learning",
    slug: "learning",
    icon: BookOpen,
    color: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    description: "교육 과정, 자격증 준비 등 학습 기록",
    children: [
      {
        name: "CloudWave",
        slug: "cloudwave",
        color: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
      },
    ],
  },
  {
    name: "Seminar",
    slug: "seminar",
    icon: Megaphone,
    color: "bg-red-500/15 text-red-600 dark:text-red-400",
    description: "세미나 후기 및 관련 정보",
    children: [
      {
        name: "Goorm",
        slug: "goorm",
        color: "bg-neutral-200/50 text-neutral-800 dark:bg-neutral-700/50 dark:text-neutral-200",
      },
    ],
  },
  {
    name: "Recap",
    slug: "recap",
    icon: ScrollText,
    color: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    description: "회고",
    children: [
      {
        name: "2025",
        slug: "2025",
        color: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
      },
    ],
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
