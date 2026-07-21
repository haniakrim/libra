# Changelog

## 2026-07-21

### Full-page Tron grid on marketing landing page
- Extended the existing `.dark body` Tron-style grid from the hero only to the entire landing page (hero, bento, features, pricing, FAQ, CTA, footer).
- Added `landing-page` class and `dark:bg-transparent` to `apps/web/app/(frontend)/(marketing)/page.tsx` so the body grid layer remains visible.
- Added dark-mode transparency rule in `packages/ui/src/styles/variables.css` to make every landing section background transparent without altering layout, fonts, spacing, or components.
- Verified in dark mode on `http://localhost:3000` with a full-page Playwright screenshot (`.screenshots/landing-grid-full-page-dark.png`); the faint cyan/teal grid is visible across the full scroll height.
- No production deploy performed. Commits `25756c4` and `a48124c` pushed to `fork/main`.

### Login blocker resolved — email-OTP end to end
- Wired Resend for `libra.agentic-lab.io`: `RESEND_API_KEY` and `RESEND_FROM` added to local env and env schema.
- Fixed Cloudflare Turnstile local test keys (`1x00000000000000000000AA` / `1x0000000000000000000000000000000AA`) in `apps/web/.env.local` and `.dev.vars`.
- Updated `apps/web/package.json` dev script to load `.env.local` after root `.env` so local overrides win.
- Disabled Stripe plugin when `STRIPE_SECRET_KEY` is missing/placeholder in development (`packages/auth/utils/stripe-config.ts` + `apps/web/env.mjs`), unblocking sign-in 500.
- Verified a real login on `http://localhost:3000`: email → OTP → `/dashboard` with user/org populated.
- No production deploy or push performed. Commit `30f0970` (local-dev env guards) already contains the required changes.

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
- `better-auth-cloudflare` and `better-auth-stripe` type drift from better-auth version bump (active: `createAuthEndpoint` / `createAuthMiddleware` no longer exported from `better-auth/plugins` in 1.6.23).
- `apps/web/build` (Next.js production) blocked on the above.

### Resolved 2026-07-20
- Paraglide edge-runtime resolution: root cause was tsconfig `extends` path resolution (TS looks in `apps/web/node_modules/@libra/typescript-config`, which did not exist as a symlink), not a missing paraglide compile artifact. Fixed via direct relative extends path. Dev server now compiles middleware in ~185ms; `x-paraglide-locale` and `x-paraglide-request-url` headers appear on responses.

### Docs
- Added `01-IMPLEMENTATION-PLAN`, `02-ARCHITECTURE`, `03-DESIGN`, `04-API-REFERENCE`, `05-DATABASE`, `06-USER-GUIDE`, `08-INTEGRATIONS`, `09-TESTING`, `10-CHANGELOG` (in this and prior commits).
- `00-INDEX` and `07-HOW-TO-RUN` already present.
- Mirrored to Obsidian vault `Projects/Libra/`.
