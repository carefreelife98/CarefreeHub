import { Injectable, Inject, Logger } from "@nestjs/common"
import { craft } from "@carefree-studio/craftity-core"
import { eq, desc } from "drizzle-orm"
import { DRIZZLE } from "../database/drizzle.module.js"
import { games, gameVersions } from "../database/schema.js"
import { AstValidatorService } from "./ast-validator.service.js"
import type { CraftityRequest, CraftityResult, NodeEventEmitter } from "@carefree-studio/shared"
import type { drizzle } from "drizzle-orm/postgres-js"
import type * as schema from "../database/schema.js"

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>

@Injectable()
export class CraftityService {
  private readonly logger = new Logger(CraftityService.name)

  constructor(
    private readonly astValidator: AstValidatorService,
    @Inject(DRIZZLE) private readonly db: DrizzleDb
  ) {}

  async runCraft(request: CraftityRequest, emitter: NodeEventEmitter): Promise<CraftityResult> {
    const result = await craft(
      request,
      { validateFn: (files) => this.astValidator.validate(files) },
      emitter
    )

    try {
      // Insert game record
      const [game] = await this.db
        .insert(games)
        .values({
          id: result.gameId,
          prdId: request.prdId ?? null,
          title: result.design.scenes[0]?.name ?? "Untitled Game",
          status: "complete",
          techStack: { framework: "Phaser 3", language: "TypeScript" },
          llmProvider: request.llm?.provider ?? "openai",
        })
        .returning()

      // Insert game version record
      await this.db.insert(gameVersions).values({
        id: result.versionId,
        gameId: game.id,
        version: 1,
        files: result.files.map((f) => ({
          path: f.path,
          content: f.content,
          hash: Buffer.from(f.content).length.toString(),
        })),
        assets: result.assets.placeholders.map((p) => ({
          name: p.name,
          type: p.shape,
          color: p.color,
          dimensions: { width: p.width, height: p.height },
        })),
        generationLog: {
          executionTimeMs: result.meta.executionTimeMs,
          llmCallCount: result.meta.llmCallCount,
          llmProvider: result.meta.llmProvider,
          validationPassed: result.validation.passed,
          validationAttempts: result.validation.attempt,
        },
      })
    } catch (dbError) {
      this.logger.error("[craftity] DB insert failed, returning result without persistence", {
        gameId: result.gameId,
        error: dbError instanceof Error ? dbError.message : String(dbError),
      })
    }

    return result
  }

  async getGame(gameId: string) {
    const rows = await this.db.select().from(games).where(eq(games.id, gameId)).limit(1)
    return rows[0] ?? null
  }

  async getLatestVersion(gameId: string) {
    const rows = await this.db
      .select()
      .from(gameVersions)
      .where(eq(gameVersions.gameId, gameId))
      .orderBy(desc(gameVersions.version))
      .limit(1)
    return rows[0] ?? null
  }
}
