# 01 — Implementation Plan

> 4-phase Tron-inspired redesign of Libra, plus a parallel 4-phase production environment setup. Phases execute strictly in order. Each phase ends with build, tests, and Playwright verification before the next starts.

## Phase status

| Phase | Title | Status | Start | End | Notes |
|---|---|---|---|---|---|
| 1 | Design system extraction + docs | **in progress** | 2026-07-20 | — | Source data captured, docs being written |
| 2 | Theme system build (tokens + components) | pending | — | — | Blocked on Phase 1 close |
| 3 | App redesign (visual pass) | pending | — | — | Blocked on Phase 2 close |
| 4 | Verification + GitHub push | pending | — | — | Blocked on Phase 3 close |
| 5 | Cloudflare env: D1 + Hyperdrive + KV + R2 | pending | — | — | Blocked on CLOUDFLARE_* credentials |
| 6 | Cloudflare env: Turnstile + Workers for Platforms | pending | — | — | Blocked on Phase 5 |
| 7 | Cloudflare env: deploy (Queues V2 + Workflows V1) | pending | — | — | Blocked on Phase 6 |
| 8 | Cloudflare env: smoke + production cutover | pending | — | — | Blocked on Phase 7 |

## Phase 1 — Design system extraction + docs (in progress)

**Goal.** Capture every design decision needed to rebuild the Tron visual language on Libra, write the spec into `docs/`, mirror to Obsidian.

**Tasks.**

- [x] Capture full-page screenshot of `https://tron.sleeplessgames.co` (homepage) via Playwright
- [x] Extract 140 CSS custom properties from reference site
- [x] Extract 20 KPI tile structures (micro-label / big-number / trend / status dot)
- [x] Extract hero composition (radar rings + sweep beam + globe lattice)
- [x] Catalog 4 signature animations + their durations
- [x] Read existing `packages/ui/src/styles/{theme,variables,globals,deployment-tokens,utils,quota}.css`
- [x] List `packages/ui/src/components/` (46 components, identify reusables)
- [x] Read reusable components: `glow`, `grid-pattern`, `gradient-border`, `sidebar`, `navbar`, `tile`, `beam`, `mockup`
- [x] Map full `apps/web/app/` route tree (route groups: `(frontend)`, `(marketing)`, `(auth)`, `(dashboard)`)
- [x] Map full `apps/web/components/` structure
- [x] Read core dashboard / marketing / auth components
- [x] Write `docs/03-DESIGN.md` (largest deliverable: 140 tokens, Mermaid palette, typography, animations, components)
- [x] Write `docs/00-INDEX.md`
- [x] Write `docs/01-IMPLEMENTATION-PLAN.md` (this file)
- [ ] Write `docs/02-ARCHITECTURE.md` (Mermaid data flow + module map)
- [ ] Write `docs/04-API-REFERENCE.md`, `05-DATABASE.md`, `06-USER-GUIDE.md`, `08-INTEGRATIONS.md`, `09-TESTING.md`, `10-CHANGELOG.md`
- [ ] Mirror all 11 docs to Obsidian at `/Users/haniakrim/Documents/Obsidian Vault/Projects/Libra/`
- [ ] Create `Projects/Libra/_HOME.md` dashboard
- [ ] Add `Libra` entry to `Projects/_ALL-PROJECTS.md` index
- [ ] Capture additional reference screenshots: hover states, scrolled states, mobile, more routes
- [ ] Git commit + push

**Success criteria.**

- 11 standard docs files exist in `docs/` (00-INDEX through 10-CHANGELOG)
- Obsidian mirror at `Projects/Libra/` matches `docs/` exactly
- All Mermaid diagrams render in Obsidian
- Every Tron token, animation, and component decision is documented
- Build + typecheck + lint pass at end of phase

## Phase 2 — Theme system build (pending)

**Goal.** Build the Tron design system as reusable design tokens + components in `packages/ui`, accessible from `apps/web` via the existing `@source` directive.

**Tasks.**

- [ ] Add 140 tokens to `packages/ui/src/styles/variables.css` (`:root` + `.dark` + `.light`)
- [ ] Add 5 keyframes + 4 utilities to `packages/ui/src/styles/utils.css`
- [ ] Add 4 new utilities to `packages/ui/src/styles/globals.css` (`@layer utilities` for `animate-pulse-cy` / `animate-tick` / `animate-sweep` / `animate-globe`)
- [ ] Extend `grid-pattern.tsx` with `highlighted` prop
- [ ] New `tron-corner-frame.tsx` (4-bracket primitive)
- [ ] New `tron-stat-card.tsx` (KPI tile, replaces `tile.tsx` glass classes)
- [ ] New `tron-status-dot.tsx` (7 status colors + halo)
- [ ] New `tron-pill-button.tsx` (solid + ghost variants)
- [ ] New `tron-hero.tsx` (animated SVG: rings + sweep + globe)
- [ ] New `tron-micro-label.tsx` (10px JetBrains Mono label)
- [ ] New `tron-animated-bg.tsx` (radar / grid drift, reusable page wrapper)
- [ ] New `glass-cy.tsx` (replaces `glass-1` / `glass-2`)
- [ ] Update `apps/web/app/layout.tsx` to import Bricolage, Manrope, JetBrains Mono, Caveat via `next/font/google`
- [ ] Verify both dark + light themes render correctly
- [ ] Build + typecheck + lint pass
- [ ] Git commit + push

**Success criteria.**

- All 11 new files exist in `packages/ui/src/components/`
- 140 tokens load correctly under `:root` + `.dark` + `.light`
- Storybook (if present) renders each component with default + hover + active states
- `prefers-reduced-motion` disables all keyframes
- Both themes verified with axe-core contrast checks (dark ≥ 15:1, light ≥ 7:1)

## Phase 3 — App redesign (pending)

**Goal.** Apply the Tron theme to every page, layout, and component in `apps/web` without changing any function or behavior.

**Tasks.**

- [ ] Marketing: `Navbar` (HUD top nav)
- [ ] Marketing: `Hero` (animated radar background, two-line headline, CTA + ghost)
- [ ] Marketing: `Bento` (cyan-bordered tiles with corner brackets)
- [ ] Marketing: `Features` (HUD stat cards)
- [ ] Marketing: `Pricing` (cyan-glow tier cards)
- [ ] Marketing: `CTA` section
- [ ] Marketing: `FAQ` (cyan-bordered accordion)
- [ ] Marketing: `Footer` (monospace micro-labels)
- [ ] Auth: `LoginForm` (cyan-glow card, blueprint grid bg)
- [ ] Dashboard: `app-sidebar` (vertical cyan rail, monospace labels, 2px active indicator)
- [ ] Dashboard: `nav-main` (cyan highlight on active)
- [ ] Dashboard: `site-header` (HUD chrome with status dot)
- [ ] Dashboard: empty states (corner-bracket frames)
- [ ] Dashboard: `Project` layout (`/project/[id]`)
- [ ] Dashboard: `Billing` (KPI cards: usage / quota / invoices)
- [ ] Dashboard: `Teams` (HUD list rows with status dots)
- [ ] Dashboard: `Integrations` (icon grid with cyan-glow)
- [ ] Dashboard: `Admin` (admin-only cyan-bordered cards)
- [ ] Re-color `ParticlesBackground` to cyan or replace with blueprint grid
- [ ] Re-theme `LoginForm` OTP step to match
- [ ] Build + typecheck + lint pass
- [ ] Git commit + push

**Success criteria.**

- Every page renders the Tron theme (animated bg + cyan borders + corner brackets)
- All existing functions preserved (login flow, project create, deploy, etc.)
- Both themes accessible via the existing `<ThemeSwitcher>`
- No new TypeScript errors
- No new lint errors

## Phase 4 — Verification (pending)

**Goal.** Verify the redesign is visually correct, fully clickable, and ships clean. Commit and push.

**Tasks.**

- [ ] `bun typecheck` (root)
- [ ] `bun lint` (root, Biome)
- [ ] `bun build` (root, Turborepo)
- [ ] `bun test` in `apps/web` and `packages/auth` (where applicable)
- [ ] Start dev server, wait until ready
- [ ] `curl` key routes (`/`, `/pricing`, `/login`, `/dashboard`) return HTTP 200
- [ ] Playwright: full-page screenshot of every route in dark + light
- [ ] Playwright: side-by-side compare to `00-screenshots-reference/`
- [ ] Playwright: click audit on every button / link / menu / tab / toggle / form control
- [ ] axe-core: contrast check on dark + light
- [ ] `prefers-reduced-motion: reduce` verified to disable all keyframes
- [ ] Final git commit + push

**Success criteria.**

- All checks pass with no errors
- Every interactive element is clickable and performs its real action
- Dark and light themes both pass WCAG 2.2 AA
- All work committed and pushed to GitHub

## Phases 5–8 — Cloudflare production env (blocked on credentials)

Awaiting `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` from the user. While blocked, prepare: provisioning scripts (Bun + Wrangler), runbook for D1 migrations, R2 bucket policies, Turnstile site-key wiring, Workers for Platforms dispatcher config, deploy queue + workflow definitions, smoke test plan. Run on credentials arrival.
