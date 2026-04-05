import { Module, Global } from "@nestjs/common"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema.js"

const DRIZZLE = Symbol("DRIZZLE")

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: () => {
        if (!process.env.DATABASE_URL) {
          throw new Error("DATABASE_URL environment variable is required")
        }
        const client = postgres(process.env.DATABASE_URL)
        return drizzle(client, { schema })
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}

export { DRIZZLE }
