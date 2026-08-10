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
      series: s.string().optional(), // 시리즈 slug (content/series/<slug>.mdx 참조)
      seriesOrder: s.number().optional(), // 시리즈 내 회차 번호 (1부터)
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

const series = defineCollection({
  name: "Series",
  pattern: "series/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(99),
      description: s.string().max(999),
      status: s.enum(["ongoing", "completed", "planned"]).default("planned"),
      order: s.number().optional(), // 시리즈 목록 정렬 순서
      cover: s.string().optional(),
      code: s.mdx(), // 시리즈 소개글 본문
    })
    .transform((data) => {
      const slugParts = data.slug.split("/")
      const slug = slugParts[slugParts.length - 1]
      return {
        ...data,
        slug,
        permalink: `/series/${slug}`,
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
  collections: { posts, series },
  prepare: ({ posts, series }) => {
    // slug는 파일명 마지막 세그먼트만 사용하므로 폴더가 달라도 파일명이 같으면 충돌 — 빌드 시점에 검증
    const seen = new Map<string, string>()
    for (const post of posts) {
      const existing = seen.get(post.slug)
      if (existing) {
        throw new Error(`중복된 slug "${post.slug}": "${existing}" 와 "${post.title}"`)
      }
      seen.set(post.slug, post.title)
    }

    // 시리즈 참조 무결성: 존재하지 않는 시리즈 참조, 회차 번호 중복을 빌드 실패로 처리
    const seriesSlugs = new Set(series.map((sr) => sr.slug))
    const orderSeen = new Map<string, string>()
    for (const post of posts) {
      if (!post.series) continue
      if (!seriesSlugs.has(post.series)) {
        throw new Error(
          `포스트 "${post.title}"가 존재하지 않는 시리즈 "${post.series}"를 참조합니다`
        )
      }
      if (post.seriesOrder == null) {
        throw new Error(`시리즈 포스트 "${post.title}"에 seriesOrder가 없습니다`)
      }
      const key = `${post.series}#${post.seriesOrder}`
      const existing = orderSeen.get(key)
      if (existing) {
        throw new Error(
          `시리즈 "${post.series}"의 ${post.seriesOrder}회차가 중복됩니다: "${existing}" 와 "${post.title}"`
        )
      }
      orderSeen.set(key, post.title)
    }
  },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
})
