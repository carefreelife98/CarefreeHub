import { posts } from "#site/content"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { siteConfig } from "@/config/site"
import { PostBreadcrumb } from "@/components/post/PostBreadcrumb"
import { PostHeader } from "@/components/post/PostHeader"
import { PostTags } from "@/components/post/PostTags"
import { MDXContent } from "@/components/mdx/MDXContent"
import { ResizablePostLayout } from "@/components/post/ResizablePostLayout"

export async function generateStaticParams() {
  return posts.map((post) => ({
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

  if (!post) {
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
  const text = content.replace(/<[^>]*>/g, "")
  const words = text.split(/\s+/).length
  return Math.ceil(words / 200)
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)

  if (!post || !post.published) {
    notFound()
  }

  const readingTime = estimateReadingTime(post.body || "")
  const primaryCategory = post.categories[0]

  return (
    <ResizablePostLayout toc={post.toc}>
      <article className="pb-60">
        {primaryCategory && <PostBreadcrumb category={primaryCategory} />}

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
