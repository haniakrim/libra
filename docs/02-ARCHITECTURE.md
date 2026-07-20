# 02 — Architecture

> Libra is an AI-powered web development platform built as a Turborepo monorepo targeting Cloudflare Workers. The system composes 12 services, 13 shared packages, and a dual-database layer (PostgreSQL for business data, D1 for auth).

## High-level system

```mermaid
flowchart TB
  classDef edge fill:#0a131f,stroke:#1fe0ff47,color:#d7f7ff
  classDef core fill:#0e1b2b,stroke:#1fe0ff,color:#d7f7ff
  classDef data fill:#0a131f,stroke:#5dffd0,color:#d7f7ff

  subgraph Client
    WEB[apps/web · Next.js 15 + React 19]:::edge
  end

  subgraph Edge
    DISP[apps/dispatcher · Workers for Platforms]:::core
    AUTH[apps/auth-studio]:::core
  end

  subgraph Services
    BUILD[apps/builder · Vite]:::core
    CDN[apps/cdn · Hono]:::core
    DEPLOY[apps/deploy · Queues V2]:::core
    WORKFLOW[apps/deploy-workflow · V1]:::core
    EMAIL[apps/email · React Email]:::core
    SHOT[apps/screenshot]:::core
    DOCS[apps/docs · FumaDocs]:::core
    TEMPL[apps/vite-shadcn-template]:::core
  end

  subgraph Shared
    UI[packages/ui · shadcn + Tailwind v4 + Tron theme]:::edge
    API[packages/api · tRPC 11]:::edge
    AUTH_PKG[packages/auth · better-auth]:::edge
    DB[packages/db · Drizzle ORM]:::edge
    SANDBOX[packages/sandbox · E2B / Daytona]:::edge
    COMMON[packages/common]:::edge
  end

  subgraph Data
    PG[(PostgreSQL via Neon + Hyperdrive)]:::data
    D1[(Cloudflare D1 / SQLite · auth)]:::data
    KV[(Cloudflare KV)]:::data
    R2[(Cloudflare R2)]:::data
  end

  WEB --> DISP
  WEB --> AUTH
  DISP --> BUILD & CDN & DEPLOY & WORKFLOW & EMAIL & SHOT & TEMPL
  WEB --> API
  API --> DB
  AUTH_PKG --> D1
  DB --> PG
  DISP --> KV & R2
  DEPLOY --> R2
  SHOT --> R2
```

## Module map

### Apps (`apps/`)

| App | Purpose | Stack |
|---|---|---|
| `web` | Main product UI, marketing, dashboard, IDE | Next.js 15, React 19, Tailwind v4, shadcn |
| `builder` | Vite build service for user projects | Vite, Bun |
| `cdn` | Asset CDN | Hono, Cloudflare Workers |
| `deploy` | Deployment service V2 (event-driven) | Hono, Cloudflare Queues |
| `deploy-workflow` | Deployment service V1 (orchestrated) | Hono, Cloudflare Workflows |
| `dispatcher` | Request routing into user subdomains | Hono, Workers for Platforms |
| `auth-studio` | Auth management console | Next.js |
| `docs` | Documentation site | Next.js + FumaDocs |
| `email` | Email service (templates + transport) | React Email, Resend |
| `screenshot` | Screenshot rendering for previews | Playwright on Cloudflare |
| `vite-shadcn-template` | Project template engine | Vite + shadcn |

### Packages (`packages/`)

| Package | Purpose |
|---|---|
| `ui` | Design system: shadcn + Tailwind v4 + Tron theme tokens + Tron components |
| `api` | tRPC 11 routers consumed by `web` |
| `auth` | `better-auth` configuration (email + GitHub OAuth + Turnstile) |
| `better-auth-cloudflare` | Cloudflare adapter for `better-auth` |
| `better-auth-stripe` | Stripe integration for `better-auth` (subscriptions, billing portal) |
| `common` | Shared utilities, types, constants |
| `db` | Drizzle ORM schemas, migrations, connection management |
| `email` | React Email templates + transport |
| `middleware` | Shared middleware (rate limit, CORS, auth gates) |
| `sandbox` | E2B / Daytona abstraction for safe code execution |
| `shikicode` | Code editor with syntax highlighting (Shiki) |
| `templates` | Project scaffolding templates |
| `ui` | Design system primitives |

## Data flow — user creates a project

```mermaid
sequenceDiagram
  participant U as User (browser)
  participant W as apps/web
  participant API as packages/api (tRPC)
  participant DB as packages/db (Drizzle)
  participant PG as PostgreSQL (Neon + Hyperdrive)
  participant S as packages/sandbox
  participant B as apps/builder
  participant D as apps/deploy
  participant R2 as Cloudflare R2

  U->>W: Click "New project" + fill form
  W->>API: tRPC mutation project.create
  API->>DB: insert project row
  DB->>PG: parameterized INSERT
  PG-->>DB: project id
  DB-->>API: project
  API-->>W: created project

  U->>W: Edit code in IDE
  W->>API: tRPC query project.read
  API->>DB: select + join
  DB->>PG: SELECT
  PG-->>DB: rows
  DB-->>API: project
  API-->>W: project

  U->>W: Click "Deploy"
  W->>API: tRPC mutation deploy.start
  API->>S: spawn sandbox
  S-->>API: sandbox handle
  API->>B: POST build (project files)
  B-->>API: build output (artifact)
  API->>D: enqueue deploy job
  D->>R2: upload artifact
  D-->>API: deploy url
  API-->>W: deployed
  W-->>U: redirect to deployed site
```

## Data flow — login

```mermaid
sequenceDiagram
  participant U as User
  participant LF as LoginForm
  participant TS as Turnstile
  participant A as packages/auth (better-auth)
  participant D1 as Cloudflare D1
  participant SES as Session cookie

  U->>LF: enter email
  LF->>TS: render challenge
  TS-->>LF: token
  LF->>A: POST /auth/sign-in/email (email + turnstile)
  A->>D1: insert OTP, create session
  A-->>LF: OTP sent
  U->>LF: enter OTP from email
  LF->>A: POST /auth/verify-otp
  A->>D1: lookup OTP, mark used
  A-->>SES: Set-Cookie
  SES-->>U: session cookie stored
  LF-->>U: redirect to /dashboard
```

## Routing

`apps/web` uses Next.js 15 App Router with route groups:

```
app/
  (frontend)/
    layout.tsx                       # root layout, providers
    (marketing)/
      page.tsx                       # landing
    (auth)/
      login/page.tsx
      signup/page.tsx
    (dashboard)/
      dashboard/
        layout.tsx                   # auth gate + sidebar
        page.tsx                     # dashboard home
        admin/page.tsx
        billing/page.tsx
        integrations/page.tsx
        session/loading.tsx
        session/page.tsx
        teams/page.tsx
      project/[id]/
        layout.tsx                   # ProjectProvider
        page.tsx
```

`apps/web/app/layout.tsx` is the single entry point that imports the Tron design tokens via Tailwind v4 `@source` directive on `packages/ui/src/**/*`.

## Theming pipeline (Tron)

```mermaid
flowchart LR
  classDef src fill:#0a131f,stroke:#1fe0ff47,color:#d7f7ff
  classDef build fill:#0e1b2b,stroke:#1fe0ff,color:#d7f7ff
  classDef use fill:#0a131f,stroke:#5dffd0,color:#d7f7ff

  T[variables.css<br/>140 tokens]:::src
  U[utils.css<br/>5 keyframes]:::src
  C[tron-*.tsx<br/>11 components]:::src
  G[globals.css<br/>Tailwind v4 entry]:::build
  TW[Tailwind @theme inline]:::build
  WEB[apps/web]:::use
  AUTH[apps/auth-studio]:::use
  DOCS[apps/docs]:::use

  T --> G
  U --> G
  C --> G
  G --> TW
  TW --> WEB
  TW --> AUTH
  TW --> DOCS
```

## Database

- **PostgreSQL (business data)** — projects, sessions (app), billing, teams, integrations. Access via Drizzle ORM through Hyperdrive connection pool.
- **D1 SQLite (auth data)** — users, OAuth accounts, OTP codes, sessions (auth). Accessed via `better-auth-cloudflare` adapter.

See `05-DATABASE.md` for full schema.

## Cloudflare services

- **Workers** — primary compute for every service
- **Durable Objects** — coordinator state (dispatcher, deploy queue)
- **D1** — auth SQLite
- **KV** — session cache, rate-limit counters, Turnstile state
- **R2** — user build artifacts, screenshots
- **Queues** — async deploy pipeline
- **Workflows** — long-running deploy orchestration
- **Workers for Platforms** — multi-tenant user project hosting via dispatcher

## Security model

- All traffic over HTTPS, HSTS preloaded
- Turnstile challenge on every auth flow
- Rate limit on auth, signup, deploy endpoints (KV-backed counters)
- All secrets in `wrangler secret` or `process.env`, never in source
- Parameterized queries via Drizzle (no string concatenation)
- Content Security Policy headers on every response
- CSRF protection on state-changing requests

## Build & deploy

See `07-HOW-TO-RUN.md` for local dev. See `01-IMPLEMENTATION-PLAN.md` Phase 5–8 for production deploy plan (blocked on CLOUDFLARE_* credentials).
