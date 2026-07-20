# Libra Production Environment Setup

This guide walks through acquiring every credential and setting required to run Libra in production. All secrets live in `.env` (gitignored). `.env.example` contains the same keys with placeholder values.

## Generated secrets (already created)

| Variable | How generated | Notes |
|----------|---------------|-------|
| `BETTER_AUTH_SECRET` | `openssl rand -hex 32` | Session/token signing secret |
| `GITHUB_WEBHOOK_SECRET` | `openssl rand -hex 32` | Webhook payload verification |

## Human-in-the-loop required credentials

For each service below, replace the `HITL_REQUIRED_*` value in `.env` with a real credential. Verify each one with a real test call before continuing to the next.

### 1. Cloudflare platform

| Variable | How to obtain | Test command |
|----------|---------------|--------------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → right sidebar **Account ID** | `curl -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID` |
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard → My Profile → **API Tokens** → Create Token | Same as above |
| `DATABASE_ID` | Cloudflare Dashboard → **D1** → Create database → copy Database ID | `wrangler d1 info $DATABASE_ID` |
| `HYPERDRIVE_ID` | `wrangler hyperdrive create libra-hyperdrive --connection-string="$POSTGRES_URL"` | `wrangler hyperdrive info $HYPERDRIVE_ID` |
| `KV_NAMESPACE_ID` | `wrangler kv namespace create LIBRA_CACHE` then `wrangler kv namespace create LIBRA_SESSIONS` | `wrangler kv namespace list` |
| `TURNSTILE_SECRET_KEY` | Cloudflare Dashboard → **Turnstile** → Add widget → copy Secret key | `curl -X POST https://challenges.cloudflare.com/turnstile/v0/siteverify -d secret=$TURNSTILE_SECRET_KEY -d response=dummy` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Same Turnstile widget → copy **Site key** | Visible in widget HTML |
| `CLOUDFLARE_ZONE_ID` | Cloudflare Dashboard → Domain → right sidebar **Zone ID** | `curl -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID` |
| `CLOUDFLARE_SAAS_ZONE_ID` | Same as above, for the SaaS/custom-domain zone | Same |
| `NEXT_PUBLIC_CLOUDFLARE_DCV_VERIFICATION_ID` | Cloudflare Dashboard → SSL/TLS → Custom Hostnames → DCV Verification ID | Only needed for custom domains |
| `DISPATCH_NAMESPACE_NAME` | Cloudflare Dashboard → **Workers for Platforms** → Dispatch namespaces | `wrangler dispatch-namespace list` |
| `DISPATCH_NAMESPACE_ACCOUNT_ID` | Same as `CLOUDFLARE_ACCOUNT_ID` unless namespace is owned by another account | Same as Cloudflare account test |

### 2. PostgreSQL database

| Variable | How to obtain | Test command |
|----------|---------------|--------------|
| `POSTGRES_URL` | Neon Dashboard → project → **Connection string** (use pooled string) | `psql "$POSTGRES_URL" -c "SELECT 1;"` |

### 3. GitHub OAuth

| Variable | How to obtain | Test command |
|----------|---------------|--------------|
| `BETTER_GITHUB_CLIENT_ID` | GitHub Settings → Developer settings → **OAuth Apps** → New OAuth App | `curl https://github.com/login/oauth/access_token?client_id=$BETTER_GITHUB_CLIENT_ID` (expect 4xx without code) |
| `BETTER_GITHUB_CLIENT_SECRET` | Same OAuth App → **Generate a new client secret** | Verify via a real login flow |
| `GITHUB_OAUTH_CLIENT_ID` | Same as `BETTER_GITHUB_CLIENT_ID` if reusing one app, or a second OAuth App | Same as above |
| `GITHUB_OAUTH_CLIENT_SECRET` | Same as above | Same as above |

### 4. Stripe payments

| Variable | How to obtain | Test command |
|----------|---------------|--------------|
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → **API keys** → Secret key | `curl -H "Authorization: Bearer $STRIPE_SECRET_KEY" https://api.stripe.com/v1/account` |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → **Webhooks** → Add endpoint → Signing secret | `stripe listen --forward-to ...` or verify signature in app |

### 5. Resend email

| Variable | How to obtain | Test command |
|----------|---------------|--------------|
| `RESEND_API_KEY` | Resend Dashboard → **API keys** → Create API key | `curl -H "Authorization: Bearer $RESEND_API_KEY" https://api.resend.com/emails` |
| `RESEND_FROM` | Resend Dashboard → **Domains** → Add domain → verify DNS → use `noreply@yourdomain.com` | Send a test email via API |

### 6. AI providers (provide at least one)

| Variable | Provider signup | Test command |
|----------|-----------------|--------------|
| `ANTHROPIC_API_KEY` | https://console.anthropic.com/ | `curl -H "x-api-key: $ANTHROPIC_API_KEY" -H "anthropic-version: 2023-06-01" https://api.anthropic.com/v1/models` |
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys | `curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models` |
| `GEMINI_API_KEY` | https://ai.google.dev/ | `curl "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY"` |
| `XAI_API_KEY` | https://console.x.ai/ | Provider-specific |
| `DEEPSEEK_API_KEY` | https://platform.deepseek.com/ | Provider-specific |
| `OPENROUTER_API_KEY` | https://openrouter.ai/keys | `curl -H "Authorization: Bearer $OPENROUTER_API_KEY" https://openrouter.ai/api/v1/auth/key` |
| Azure OpenAI variables | Azure Portal → Azure OpenAI Service | Azure SDK test call |

### 7. Sandbox providers (choose one)

| Variable | Provider signup | Test command |
|----------|-----------------|--------------|
| `E2B_API_KEY` | https://e2b.dev/dashboard | E2B SDK `e2b.init()` |
| `DAYTONA_API_KEY` | https://app.daytona.io/dashboard/settings | Daytona SDK health check |

### 8. Optional integrations

| Variable | How to obtain | When needed |
|----------|---------------|-------------|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project settings → Project API Key | Product analytics |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog project settings → API host | Product analytics |
| `LIBRA_GITHUB_TOKEN` | GitHub Settings → Developer settings → Personal access tokens | GitHub automation |
| `LIBRA_GITHUB_OWNER` / `LIBRA_GITHUB_REPO` | Repository URL | GitHub automation |
| `GITHUB_APP_*` variables | GitHub Settings → Developer settings → **GitHub Apps** → New GitHub App | Deep repository/webhook integration |

## After filling credentials

1. Run migrations:
   ```bash
   cd packages/auth && bun db:migrate
   cd ../db && bun db:migrate
   ```
2. Run type checks:
   ```bash
   bun typecheck
   ```
3. Build all packages:
   ```bash
   bun build
   ```
4. Start services and verify routes return 200 with clean logs.

## Local development defaults

For local development, copy `.env.example` to `.env` and use localhost URLs. The `.dev.vars` files inside individual apps provide worker-local overrides.
