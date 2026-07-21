# Self-hosted (VPS/Docker) build of apps/web. Separate from the Cloudflare/
# OpenNext deploy path (`bun run deploy` in apps/web) — this produces a plain
# Next.js server run via `next start`, not a Worker.

FROM oven/bun:1 AS deps
WORKDIR /repo
COPY . .
RUN bun install --frozen-lockfile

FROM deps AS builder
WORKDIR /repo
ENV SELF_HOSTED=true
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=6144"
ENV AUTH_DB_PATH=/data/auth.db
ENV REDIS_URL=redis://127.0.0.1:6379
# Next's build-time "collect page data" step imports the auth route module,
# which eagerly initializes better-auth (module-level `toNextJsHandler(await
# initAuth())`) — it needs a real, already-migrated sqlite file to connect to
# at build time, same as the Cloudflare path needs a working local D1 file.
# This build-stage /data is throwaway: the runner stage never copies it, and
# the real runtime file lives in the mounted volume, migrated again by CMD.
RUN mkdir -p /data \
    && cd apps/web && bun run ../../packages/auth/db/migrate-selfhost.ts
RUN cd apps/web && bunx paraglide-js compile --project ./project.inlang --outdir ./paraglide
RUN cd apps/web && bunx next build

FROM oven/bun:1-slim AS runner
RUN groupadd -r libra && useradd -r -g libra libra
WORKDIR /repo
ENV NODE_ENV=production
ENV SELF_HOSTED=true
ENV HOSTNAME=0.0.0.0
RUN mkdir -p /data && chown -R libra:libra /data
COPY --from=builder --chown=libra:libra /repo/node_modules ./node_modules
COPY --from=builder --chown=libra:libra /repo/package.json ./package.json
COPY --from=builder --chown=libra:libra /repo/packages ./packages
COPY --from=builder --chown=libra:libra /repo/apps/web ./apps/web

USER libra
WORKDIR /repo/apps/web
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=30s \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1

CMD ["sh", "-c", "bun run ../../packages/auth/db/migrate-selfhost.ts && bun run start"]
