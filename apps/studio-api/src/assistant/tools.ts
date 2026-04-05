// apps/api/src/assistant/tools.ts

import { tool } from "langchain"
import { z } from "zod"
import { searchGooglePlay, searchAppStore } from "@carefree-studio/scraper-adapters"

export const searchPlayStoreTool = tool(
  async ({ keyword }) => {
    try {
      const results = await searchGooglePlay(keyword, 5)
      if (results.length === 0) return "No results found."
      return results
        .map((r) => `- ${r.title} (★${(r.score ?? 0).toFixed(1)}, ${r.genre || "N/A"})`)
        .join("\n")
    } catch {
      return "Google Play search failed."
    }
  },
  {
    name: "search_google_play",
    description:
      "Search Google Play Store for mobile games by keyword. Returns game titles, ratings, and genres.",
    schema: z.object({
      keyword: z.string().describe("Search keyword for mobile games"),
    }),
  }
)

export const searchAppStoreTool = tool(
  async ({ keyword }) => {
    try {
      const results = await searchAppStore(keyword, 5)
      if (results.length === 0) return "No results found."
      return results
        .map((r) => `- ${r.title} (★${(r.score ?? 0).toFixed(1)}, ${r.genre || "N/A"})`)
        .join("\n")
    } catch {
      return "App Store search failed."
    }
  },
  {
    name: "search_app_store",
    description:
      "Search Apple App Store for mobile games by keyword. Returns game titles, ratings, and genres.",
    schema: z.object({
      keyword: z.string().describe("Search keyword for mobile games"),
    }),
  }
)

export const agentTools = [searchPlayStoreTool, searchAppStoreTool]
