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

## Auth flow verification checklist (completed 2026-07-21)

| Step | Route / action | Expected result | Status |
|------|----------------|-----------------|--------|
| 1 | `GET /login` | Page renders 200, Turnstile widget invisible | ✅ |
| 2 | `POST /api/auth/email-otp/send-verification-otp` | 200 OK, captcha passes, OTP email sent | ✅ |
| 3 | Resend API | Email delivered with 6-digit OTP to inbox | ✅ |
| 4 | `POST /api/auth/sign-in/email-otp` | 200 OK, `set-auth-token` header returned | ✅ |
| 5 | Browser redirect | Lands on `/dashboard`, user/org shown in nav | ✅ |

## E2E CI

- `.github/workflows/web-e2e.yml` runs the Playwright suite on PR/push for `apps/web` and shared packages.
- It writes a headless `.env` with dummy fallbacks so the Next.js dev server can start without real third-party keys.
- To exercise the real email-OTP sign-in path in CI, configure these repository secrets:
  - `E2E_RESEND_API_KEY` — a valid Resend API key
  - `E2E_CAPTURE_OTP` — set to `true`
  - `E2E_TEST_EMAIL` — inbox that receives the OTP (defaults to `e2e@example.com`)
- When those secrets are absent, the real-OTP test skips automatically and the mocked flow still runs.

## Current state

- `bun typecheck` — 13/13 packages pass.
- `bun build --filter libra-core --filter @libra/auth ...` — passes for auth, web, and touched packages.
- Dev server boots; `/`, `/login`, and `/dashboard` return 200.
- Email-OTP login verified end to end via Playwright on `http://localhost:3000`.
- Pre-existing test failures remain in unrelated suites (`packages/auth` annual-quota-refresh module resolution, `apps/web` ai/generate assertions, React CJS resolution). These are not login blockers and are tracked separately.
