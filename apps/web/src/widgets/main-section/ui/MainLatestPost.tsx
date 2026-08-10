import { ChevronRightIcon } from "lucide-react"
import { ThumbnailPost } from "@features/post"
import { Button } from "@shared/ui"
import Link from "next/link"
import { getCategoryColor } from "@shared/config"
import { getLatestPosts } from "@shared/lib/posts"

export function MainLatestPost() {
  const latestPosts = getLatestPosts(8)

  return (
    <div>
      <div className="w-full flex flex-row items-center justify-between">
        <h1 className="text-xl whitespace-nowrap font-bold text-muted-foreground">최근 게시글</h1>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/posts" className="flex flex-row items-center justify-center gap-2">
            <span>전체 보기</span>
            <ChevronRightIcon className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="w-full">
        {latestPosts.map((post) => (
          <ThumbnailPost
            key={post.slug}
            title={post.title}
            description={post.description || ""}
            createdAt={new Date(post.date).toLocaleDateString("ko-KR")}
            createdBy={post.author}
            thumbnailUrl={post.thumbnail || "https://picsum.photos/200/300"}
            linkUrl={`/posts/${post.slug}`}
            chips={post.categories.map((cat) => ({
              label: cat,
              href: `/posts/category/${cat.toLowerCase()}`,
              color: getCategoryColor(cat.toLowerCase()),
            }))}
          />
        ))}
      </div>
    </div>
  )
}
