// apps/api/src/database/schema.ts

import {
  pgTable,
  uuid,
  varchar,
  decimal,
  integer,
  text,
  timestamp,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import type {
  ParsedParams,
  Competitor,
  ReviewInsights,
  GameConcept,
  GentityReport,
} from "@carefree-studio/shared"
import type { BuildityStep } from "@carefree-studio/shared"

export const competitors = pgTable(
  "competitors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    platform: varchar("platform", { length: 20 }).notNull(),
    appId: varchar("app_id", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    score: decimal("score", { precision: 2, scale: 1 }).notNull(),
    ratings: integer("ratings").notNull(),
    installs: varchar("installs", { length: 50 }).notNull(),
    genre: varchar("genre", { length: 100 }).notNull(),
    description: text("description").notNull(),
    iconUrl: text("icon_url").notNull(),
    fetchedAt: timestamp("fetched_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("platform_app_id_idx").on(table.platform, table.appId)]
)

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  competitorId: uuid("competitor_id")
    .notNull()
    .references(() => competitors.id),
  platform: varchar("platform", { length: 20 }).notNull(),
  reviewId: varchar("review_id", { length: 255 }).notNull(),
  text: text("text").notNull(),
  score: integer("score").notNull(),
  thumbsUp: integer("thumbs_up").notNull().default(0),
  createdAt: timestamp("created_at").notNull(),
  fetchedAt: timestamp("fetched_at").notNull().defaultNow(),
})

export const analyses = pgTable("analyses", {
  id: uuid("id").primaryKey().defaultRandom(),
  query: varchar("query", { length: 255 }).notNull(),
  parsedParams: jsonb("parsed_params").$type<ParsedParams>().notNull(),
  competitors: jsonb("competitors").$type<Competitor[]>().notNull(),
  insights: jsonb("insights").$type<ReviewInsights>().notNull(),
  concept: jsonb("concept").$type<GameConcept>().notNull(),
  finalReport: jsonb("final_report").$type<GentityReport>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const prds = pgTable("prds", {
  id: uuid("id").primaryKey().defaultRandom(),
  analysisId: uuid("analysis_id").references(() => analyses.id),
  steps: jsonb("steps").$type<BuildityStep[]>().notNull(),
  markdown: text("markdown").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
