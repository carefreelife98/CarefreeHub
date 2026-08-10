import { posts } from "#site/content"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { siteConfig } from "@shared/config"
import {
  PostBreadcrumb,
  PostHeader,
  PostTags,
  MDXContent,
  ResizablePostLayout,
} from "@features/post"
import { PostAnalytics } from "@features/analytics"
import { getSeriesNavData, SeriesNav } from "@features/series"

export async function generateStaticParams() {
  return posts
    .filter((post) => post.published)
    .map((post) => ({
      slug: post.slug,
    }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)

  if (!post || !post.published) {
    return {
      title: "Post Not Found",
    }
  }

  const ogImage = post.thumbnail || `${siteConfig.url}/og-default.png`

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${siteConfig.url}/posts/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [post.author],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  }
}

function estimateReadingTime(content: string): number {
  const text = content
    .replace(/```[\s\S]*?```/g, " ") // 코드 블록 제거
    .replace(/<[^>]*>/g, " ")
    .replace(/[#>*`_~[\]()!|-]/g, " ") // 마크다운 문법 제거
  // 한국어는 분당 약 500자, 영어는 분당 약 200단어 기준
  const koreanChars = (text.match(/[가-힣]/g) || []).length
  const words = text
    .replace(/[가-힣]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(koreanChars / 500 + words / 200))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)

  if (!post || !post.published) {
    notFound()
  }

  const readingTime = estimateReadingTime(post.body || "")
  const primaryCategory = post.categories[0]
  const seriesNav = getSeriesNavData(post)

  return (
    <ResizablePostLayout toc={post.toc}>
      <PostAnalytics postSlug={post.slug} />
      <article className="pb-60">
        {primaryCategory && <PostBreadcrumb category={primaryCategory} />}

        {seriesNav && <SeriesNav nav={seriesNav} currentSlug={post.slug} />}

        <PostHeader
          title={post.title}
          description={post.description}
          author={post.author}
          date={post.date}
          readingTime={readingTime}
          categories={post.categories}
          thumbnail={post.thumbnail}
        />

        <MDXContent code={post.code} />

        <PostTags tags={post.tags} />
      </article>
    </ResizablePostLayout>
  )
}
