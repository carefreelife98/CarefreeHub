FROM node:22-slim AS base
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate
WORKDIR /app

# 1. Copy workspace root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./

# 2. Copy package manifests only (for cache-friendly install)
COPY packages/shared/package.json packages/shared/
COPY packages/scraper-adapters/package.json packages/scraper-adapters/
COPY packages/gentity-core/package.json packages/gentity-core/
COPY apps/studio-api/package.json apps/studio-api/

# 3. Install dependencies
RUN pnpm install --frozen-lockfile

# 4. Copy source code
COPY packages/shared/ packages/shared/
COPY packages/scraper-adapters/ packages/scraper-adapters/
COPY packages/gentity-core/ packages/gentity-core/
COPY apps/studio-api/ apps/studio-api/

# 5. Build packages in order, then API
RUN pnpm --filter @carefree-studio/shared build && \
    pnpm --filter @carefree-studio/scraper-adapters build && \
    pnpm --filter @carefree-studio/gentity-core build && \
    pnpm --filter @carefree-studio/api build

# 6. Production stage
FROM node:22-slim AS runner
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate
WORKDIR /app

COPY --from=base /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=base /app/node_modules/ node_modules/
COPY --from=base /app/packages/shared/dist/ packages/shared/dist/
COPY --from=base /app/packages/shared/package.json packages/shared/
COPY --from=base /app/packages/scraper-adapters/dist/ packages/scraper-adapters/dist/
COPY --from=base /app/packages/scraper-adapters/package.json packages/scraper-adapters/
COPY --from=base /app/packages/gentity-core/dist/ packages/gentity-core/dist/
COPY --from=base /app/packages/gentity-core/package.json packages/gentity-core/
COPY --from=base /app/apps/studio-api/dist/ apps/studio-api/dist/
COPY --from=base /app/apps/studio-api/package.json apps/studio-api/
COPY --from=base /app/apps/studio-api/node_modules/ apps/studio-api/node_modules/

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["node", "apps/studio-api/dist/main.js"]
