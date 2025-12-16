import Link from "next/link"

interface PostTagsProps {
  tags: string[]
}

export function PostTags({ tags }: PostTagsProps) {
  if (tags.length === 0) {
    return null
  }

  return (
    <div className="mt-12 pt-6 border-t border-border">
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/posts/tag/${tag.toLowerCase()}`}
            className="text-sm px-3 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </div>
  )
}
