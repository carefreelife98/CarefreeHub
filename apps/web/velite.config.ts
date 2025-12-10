import { defineConfig, defineCollection, s } from "velite"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"

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
      body: s.markdown(),
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
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: "github-dark" }],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["anchor"],
          },
        },
      ],
    ],
  },
})
