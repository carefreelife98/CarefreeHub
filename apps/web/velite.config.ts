import { defineConfig, defineCollection, s } from "velite"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      date: s.isodate(),
      updated: s.isodate().optional(),
      published: s.boolean().default(true),
      categories: s.array(s.string()).default([]),
      tags: s.array(s.string()).default([]),
      author: s.string().default("Carefreelife98"),
      thumbnail: s.string().optional(),
      featured: s.number().optional(),
      code: s.mdx(),
      body: s.raw(),
      toc: s.toc(),
    })
    .transform((data) => {
      // s.path()는 "posts/hello-velite" 형태로 반환하므로 마지막 segment만 사용
      const slugParts = data.slug.split("/")
      const slug = slugParts[slugParts.length - 1]
      return {
        ...data,
        slug,
        permalink: `/posts/${slug}`,
      }
    }),
})

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts },
  // slug는 파일명 마지막 세그먼트만 사용하므로 폴더가 달라도 파일명이 같으면 충돌 — 빌드 시점에 검증
  prepare: ({ posts }) => {
    const seen = new Map<string, string>()
    for (const post of posts) {
      const existing = seen.get(post.slug)
      if (existing) {
        throw new Error(`중복된 slug "${post.slug}": "${existing}" 와 "${post.title}"`)
      }
      seen.set(post.slug, post.title)
    }
  },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
})
