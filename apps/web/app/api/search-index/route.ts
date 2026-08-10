import { posts } from "#site/content"

// 검색 다이얼로그용 경량 인덱스 (본문 제외 메타데이터만)
// 빌드 타임에 정적 생성되어 클라이언트 번들 크기에 영향을 주지 않는다
export const dynamic = "force-static"

export interface SearchIndexItem {
  slug: string
  title: string
  description: string
  tags: string[]
  categories: string[]
}

export async function GET() {
  const index: SearchIndexItem[] = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description || "",
      tags: post.tags,
      categories: post.categories,
    }))

  return Response.json(index)
}
