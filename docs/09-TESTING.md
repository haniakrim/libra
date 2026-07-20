# Testing

## Test types

| Type | Tool | Scope |
|------|------|-------|
| Unit | Vitest | Functions, utils, components in packages/* |
| Integration | Vitest + tRPC test client | API endpoints, DB calls |
| E2E | Playwright (via gstack `/qa`) | Auth flow, project creation, deploy flow |
| Typecheck | `tsc --noEmit` | All packages via `bun typecheck` |
| Lint | Biome | `bun lint` / `bun lint:fix` |
| Build | `bun build` | Every workspace |

## Per-task verification

Before any feature is "done":

1. `bun typecheck` passes for touched packages
2. `bun build` passes
3. `bun test` passes
4. Dev server boots, target routes return 200 (see Verified App URLs Only)
5. Playwright clickability audit on every interactive UI element

## Coverage target

80% minimum per file. Enforced by Vitest `--coverage` and the tdd-guide agent.

## Current state (Phase 2)

- `bun typecheck` — 6/13 packages pass; 1 fail (`better-auth-cloudflare` — pre-existing type drift from better-auth version bump).
- `bun build` — pre-existing failures in `better-auth-stripe` (DTS) and `apps/web` (ts-config path resolution — fixed via symlink in `node_modules/@libra/typescript-config`).
- Dev server boots; `/` and `/login` return 200.
- tRPC + better-auth routes return 404 due to a pre-existing Turbopack `@/paraglide/server` edge runtime resolution issue. Tracked separately.
