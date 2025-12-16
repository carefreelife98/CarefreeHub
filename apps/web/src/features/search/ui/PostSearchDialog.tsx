"use client"

import { useRouter } from "next/navigation"
import { FileText, Tag, Folder } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@shared/ui"
import { posts } from "#site/content"
import { getCategoryCustomIcon } from "@shared/icons"

interface PostSearchDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function PostSearchDialog({ open, setOpen }: PostSearchDialogProps) {
  const router = useRouter()

  // 발행된 포스트만 필터링
  const publishedPosts = posts.filter((post) => post.published)

  // 모든 카테고리 추출 (중복 제거)
  const categories = [...new Set(publishedPosts.flatMap((post) => post.categories))]

  // 모든 태그 추출 (중복 제거, 상위 10개)
  const tags = [...new Set(publishedPosts.flatMap((post) => post.tags))].slice(0, 10)

  const handleSelectPost = (slug: string) => {
    router.push(`/posts/${slug}`)
    setOpen(false)
  }

  const handleSelectCategory = (category: string) => {
    router.push(`/posts/category/${category}`)
    setOpen(false)
  }

  const handleSelectTag = (tag: string) => {
    router.push(`/posts/tag/${tag}`)
    setOpen(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="포스트, 카테고리, 태그 검색..." />
      <CommandList>
        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>

        {/* 포스트 목록 */}
        <CommandGroup heading="포스트">
          {publishedPosts.map((post) => (
            <CommandItem
              key={post.slug}
              value={`${post.title} ${post.description || ""} ${post.tags.join(" ")}`}
              onSelect={() => handleSelectPost(post.slug)}
            >
              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span>{post.title}</span>
                {post.description && (
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {post.description}
                  </span>
                )}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* 카테고리 목록 */}
        <CommandGroup heading="카테고리">
          {categories.map((category) => {
            const CategoryIcon = getCategoryCustomIcon(category)
            return (
              <CommandItem
                key={category}
                value={`category ${category}`}
                onSelect={() => handleSelectCategory(category)}
              >
                {CategoryIcon ? (
                  <CategoryIcon size={16} />
                ) : (
                  <Folder className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="ml-2">{category}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        {/* 태그 목록 */}
        <CommandGroup heading="태그">
          {tags.map((tag) => (
            <CommandItem key={tag} value={`tag ${tag}`} onSelect={() => handleSelectTag(tag)}>
              <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>#{tag}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
