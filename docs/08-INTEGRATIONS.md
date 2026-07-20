# Integrations

## Required for production deploy

| Service | Env var(s) | Purpose |
|---------|-----------|---------|
| Cloudflare | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` | Workers, D1, R2, KV, Hyperdrive |
| GitHub OAuth (auth) | `BETTER_GITHUB_CLIENT_ID`, `BETTER_GITHUB_CLIENT_SECRET` | Login |
| GitHub OAuth (repo) | `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET` | Repo access (can reuse auth app) |
| Cloudflare Turnstile | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Bot protection |
| PostgreSQL | `POSTGRES_URL` (real Neon pooled string) | Business data |
| Stripe | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Payments |
| Resend | `RESEND_API_KEY`, `RESEND_FROM` | Transactional email |

## AI providers (provide at least one)

- Anthropic: `ANTHROPIC_API_KEY`
- OpenAI: `OPENAI_API_KEY`
- Google Gemini: `GEMINI_API_KEY`
- xAI: `XAI_API_KEY`
- DeepSeek: `DEEPSEEK_API_KEY`
- OpenRouter: `OPENROUTER_API_KEY`
- Custom: `CUSTOM_API_KEY`, `AI_BASE_URL`, `AI_MODEL`
- Azure OpenAI: `AZURE_*` set
- Databricks: `DATABRICKS_TOKEN`, `DATABRICKS_BASE_URL`
- Cloudflare AI Gateway: `CLOUDFLARE_AIGATEWAY_NAME`

## Sandbox providers (one of)

- E2B: `E2B_API_KEY`
- Daytona: `DAYTONA_API_KEY`, `DAYTONA_API_URL`, `DAYTONA_TARGET`, `DAYTONA_TIMEOUT`

## MCPs / optional

- PostHog analytics: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
- Google Analytics: `NEXT_PUBLIC_GA_ID`
- GitHub App: `GITHUB_APP_*`
- Hyperdrive: `HYPERDRIVE_ID` (set in wrangler, mirrored in `.env`)

## Cloudflare resources currently bound

- D1 `libra-auth` → `65130247-5f4b-40f7-bbda-d7a1c8516609`
- KV `KV` → `bea3e204621c4ea1aa92052b8a415c45`
- KV `CACHE` → `974adfbf070445808d000205e2f478ba`
- Hyperdrive `HYPERDRIVE` → `c00328e4ab70457fb86356e1e325ef7d`
- R2 `NEXT_INC_CACHE_R2_BUCKET` → `libra-inc-cache`
- DO bindings: `NEXT_CACHE_DO_QUEUE`, `NEXT_TAG_CACHE_DO_SHARDED`
- Custom domain route: `libra.dev`
