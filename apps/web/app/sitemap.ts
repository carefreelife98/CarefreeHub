import { posts } from "#site/content"
import { siteConfig } from "@/config/site"
import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const postUrls = posts
    .filter((post) => post.published)
    .map((post) => ({
      url: `${siteConfig.url}/posts/${post.slug}`,
      lastModified: post.updated ? new Date(post.updated) : new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))

  const categories = Array.from(new Set(posts.flatMap((post) => post.categories)))
  const categoryUrls = categories.map((category) => ({
    url: `${siteConfig.url}/posts/category/${category.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  const tags = Array.from(new Set(posts.flatMap((post) => post.tags)))
  const tagUrls = tags.map((tag) => ({
    url: `${siteConfig.url}/posts/tag/${tag.toLowerCase()}`,
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
    ...postUrls,
    ...categoryUrls,
    ...tagUrls,
  ]
}
