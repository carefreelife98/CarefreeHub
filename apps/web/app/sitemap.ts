import { posts } from "#site/content"
import { siteConfig, getAllCategorySlugs } from "@shared/config"
import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const publishedPosts = posts.filter((post) => post.published)

  const postUrls = publishedPosts.map((post) => ({
    url: `${siteConfig.url}/posts/${post.slug}`,
    lastModified: post.updated ? new Date(post.updated) : new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  // 카테고리 트리 전체 (부모 카테고리 포함)
  const categoryUrls = getAllCategorySlugs().map((slug) => ({
    url: `${siteConfig.url}/posts/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  // 발행된 포스트의 태그만 노출 (URL 인코딩 필수 — 공백/한글/# 태그 대응)
  const tags = Array.from(new Set(publishedPosts.flatMap((post) => post.tags)))
  const tagUrls = tags.map((tag) => ({
    url: `${siteConfig.url}/posts/tag/${encodeURIComponent(tag.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }))

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/posts`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/recap`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/portfolio/flow-ai`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...postUrls,
    ...categoryUrls,
    ...tagUrls,
  ]
}
