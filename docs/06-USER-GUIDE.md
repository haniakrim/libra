# Libra User Guide

Libra is an AI-powered web development platform. Sign in with GitHub, describe what you want, and the AI builds, runs, and deploys a working preview.

## Core flows

1. **Sign in** — `/login` → GitHub OAuth via better-auth.
2. **Create project** — `/new` → pick a template, describe the app, the AI scaffolds it.
3. **Iterate** — chat with the AI in the editor; it edits files, runs commands, shows diffs.
4. **Preview** — every project gets a sandboxed preview URL.
5. **Deploy** — one click ships the project to a Cloudflare Worker with a `*.libra.dev` URL.
6. **Billing** — `/settings/billing` for plans, usage, invoices (Stripe).

## Routes

| Path | Purpose |
|------|---------|
| `/` | Marketing landing page |
| `/pricing` | Plan tiers |
| `/login`, `/signup` | Auth |
| `/dashboard` | Project list |
| `/projects/[id]` | Project workspace + editor |
| `/settings/*` | Profile, org, billing, integrations |

## Tiers

- **FREE** — sandbox previews, 100 AI messages/month, community templates.
- **PRO** — production deploys, custom domains, 5k messages/month.
- **TEAM** — orgs, shared sandboxes, role-based access.
