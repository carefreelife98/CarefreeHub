"use client"

import { useEffect, useState } from "react"
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
import { getCategoryCustomIcon } from "@shared/icons"
import { trackSearch } from "@features/analytics"

interface SearchIndexItem {
  slug: string
  title: string
  description: string
  tags: string[]
  categories: string[]
}

interface PostSearchDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const tagHref = (tag: string) => `/posts/tag/${encodeURIComponent(tag.toLowerCase())}`

export function PostSearchDialog({ open, setOpen }: PostSearchDialogProps) {
  const router = useRouter()
  const [index, setIndex] = useState<SearchIndexItem[] | null>(null)
  const [query, setQuery] = useState("")

  // 다이얼로그 최초 오픈 시에만 인덱스 로드 (전체 포스트 본문을 번들에 싣지 않기 위함)
  useEffect(() => {
    if (!open || index !== null) return
    let cancelled = false
    fetch("/api/search-index")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SearchIndexItem[]) => {
        if (!cancelled) setIndex(data)
      })
      .catch(() => {
        if (!cancelled) setIndex([])
      })
    return () => {
      cancelled = true
    }
  }, [open, index])

  // 검색어 추적 (입력 멈춘 후 800ms)
  useEffect(() => {
    if (!query.trim()) return
    const timer = setTimeout(() => trackSearch({ query: query.trim() }), 800)
    return () => clearTimeout(timer)
  }, [query])

  const publishedPosts = index ?? []
  const categories = [...new Set(publishedPosts.flatMap((post) => post.categories))]
  const tags = [...new Set(publishedPosts.flatMap((post) => post.tags))].slice(0, 10)

  const handleSelectPost = (slug: string) => {
    router.push(`/posts/${slug}`)
    setOpen(false)
  }

  const handleSelectCategory = (category: string) => {
    router.push(`/posts/category/${category.toLowerCase()}`)
    setOpen(false)
  }

  const handleSelectTag = (tag: string) => {
    router.push(tagHref(tag))
    setOpen(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="포스트, 카테고리, 태그 검색..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {index === null ? "불러오는 중..." : "검색 결과가 없습니다."}
        </CommandEmpty>

        {/* 포스트 목록 */}
        <CommandGroup heading="포스트">
          {publishedPosts.map((post) => (
            <CommandItem
              key={post.slug}
              value={`${post.title} ${post.description} ${post.tags.join(" ")}`}
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
