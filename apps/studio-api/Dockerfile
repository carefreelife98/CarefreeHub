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

# 6. Production stage — keep full workspace to preserve pnpm links
FROM node:22-slim AS runner
WORKDIR /app

COPY --from=base /app/ .

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["node", "apps/studio-api/dist/main.js"]
