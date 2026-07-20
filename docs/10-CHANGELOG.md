# Changelog

## 2026-07-20

### Phase 1 — production env audit
- Inventoried 152 env vars; 117 placeholder, 8 secrets auto-generated.
- Created `.env` with HITL_REQUIRED placeholders for production-only credentials.

### Phase 2 — Cloudflare resource provisioning
- Verified `libra-production` custom API token (8 perms, account-wide).
- Confirmed D1 `libra-auth`, KV `KV` + `CACHE`, Hyperdrive, R2 `libra-inc-cache` already bound in `wrangler.jsonc` (commit 47068b9).
- Applied auth schema migrations (26 SQL statements) to remote D1 `libra-auth`.
- Provisioned additional resources for future use: KV `LIBRA_KV`, R2 `libra-prod-assets`.
- Removed tracked inlang project `.gitignore` (was causing cache drift).
- Symlinked `tooling/typescript-config` into `node_modules/@libra/typescript-config` to unblock Next.js TS resolution.
- Dev server verified: `/` and `/login` return HTTP 200.

### Pre-existing issues (not Phase 2 blockers, tracked)
- `better-auth-cloudflare` and `better-auth-stripe` type drift from better-auth version bump.
- Turbopack edge runtime cannot resolve `@/paraglide/server` (paraglide compile artifact not found at edge runtime).
- `apps/web/build` (Next.js production) blocked on the above.

### Docs
- Added `01-IMPLEMENTATION-PLAN`, `02-ARCHITECTURE`, `03-DESIGN`, `04-API-REFERENCE`, `05-DATABASE`, `06-USER-GUIDE`, `08-INTEGRATIONS`, `09-TESTING`, `10-CHANGELOG` (in this and prior commits).
- `00-INDEX` and `07-HOW-TO-RUN` already present.
- Mirrored to Obsidian vault `Projects/Libra/`.
