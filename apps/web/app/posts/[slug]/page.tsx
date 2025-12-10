import { posts } from "#site/content"
import { notFound } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Metadata } from "next"
import { siteConfig } from "@/config/site"

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

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)

  if (!post || !post.published) {
    notFound()
  }

  return (
    <article className="container max-w-3xl py-6 lg:py-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{post.title}</h1>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("ko-KR")}
          </time>
          <span>·</span>
          <span>{post.author}</span>
        </div>

        {post.categories.length > 0 && (
          <div className="flex gap-2">
            {post.categories.map((cat) => (
              <Link
                key={cat}
                href={`/posts/category/${cat.toLowerCase()}`}
                className="text-sm bg-secondary px-2 py-1 rounded hover:bg-secondary/80 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        <Separator />

        <div
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {post.tags.length > 0 && (
          <>
            <Separator />
            <div className="flex gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/posts/tag/${tag.toLowerCase()}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </article>
  )
}
