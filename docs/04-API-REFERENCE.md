# 04 — API Reference

> Libra exposes a single tRPC 11 API at `apps/web/app/api/trpc/[trpc]/route.ts`. All routers live in `packages/api/src/router/`. Frontend clients consume them via `@/lib/trpc` wrappers. This doc lists every router, every procedure, its inputs, and its outputs.

## Conventions

- **Mutations** = `POST`, side effects
- **Queries** = `GET`, read-only
- All inputs validated with Zod
- All outputs typed end-to-end via Drizzle inferred types
- Auth required unless marked **public**
- Errors are TRPCError with a code (`UNAUTHORIZED`, `FORBIDDEN`, `BAD_REQUEST`, `NOT_FOUND`, `INTERNAL_SERVER_ERROR`)

## Auth — `authRouter`

| Procedure | Type | Auth | Input | Output |
|---|---|---|---|---|
| `auth.getSession` | query | session | none | `{ user: User, session: Session } \| null` |
| `auth.signOut` | mutation | session | none | `{ success: true }` |
| `auth.listAccounts` | query | session | none | `Account[]` |
| `auth.unlinkAccount` | mutation | session | `{ providerId: string }` | `{ success: true }` |

Better-Auth handles the actual sign-in flows (email OTP, GitHub OAuth). The tRPC layer is for read-side session/account data.

## Projects — `projectRouter`

| Procedure | Type | Auth | Input | Output |
|---|---|---|---|---|
| `project.create` | mutation | session | `{ name: string, description?: string, template?: string }` | `Project` |
| `project.list` | query | session | `{ page?: number, limit?: number }` | `{ items: Project[], total: number }` |
| `project.read` | query | session | `{ id: string }` | `Project & { files: File[] }` |
| `project.update` | mutation | session | `{ id: string, name?: string, description?: string }` | `Project` |
| `project.delete` | mutation | session | `{ id: string }` | `{ success: true }` |
| `project.duplicate` | mutation | session | `{ id: string }` | `Project` |
| `project.invite` | mutation | session | `{ id: string, email: string, role: 'viewer' \| 'editor' \| 'admin' }` | `{ success: true }` |
| `project.listMembers` | query | session | `{ id: string }` | `Member[]` |
| `project.removeMember` | mutation | session | `{ id: string, userId: string }` | `{ success: true }` |

## Deploy — `deployRouter`

| Procedure | Type | Auth | Input | Output |
|---|---|---|---|---|
| `deploy.start` | mutation | session | `{ projectId: string, env?: 'preview' \| 'production' }` | `{ deployId: string }` |
| `deploy.status` | query | session | `{ deployId: string }` | `Deploy & { logs: LogLine[] }` |
| `deploy.list` | query | session | `{ projectId: string, page?: number, limit?: number }` | `{ items: Deploy[], total: number }` |
| `deploy.cancel` | mutation | session | `{ deployId: string }` | `{ success: true }` |
| `deploy.promote` | mutation | session | `{ deployId: string }` | `Deploy` (now production) |
| `deploy.rollback` | mutation | session | `{ projectId: string, toDeployId: string }` | `Deploy` |

## Billing — `billingRouter`

| Procedure | Type | Auth | Input | Output |
|---|---|---|---|---|
| `billing.subscription` | query | session | none | `Subscription \| null` |
| `billing.createCheckout` | mutation | session | `{ planId: 'free' \| 'pro' \| 'team' }` | `{ url: string }` |
| `billing.createPortal` | mutation | session | none | `{ url: string }` |
| `billing.invoices` | query | session | `{ page?: number, limit?: number }` | `{ items: Invoice[], total: number }` |
| `billing.usage` | query | session | `{ period?: 'current' \| 'last' }` | `{ builds: number, deploys: number, storage: number }` |
| `billing.quota` | query | session | none | `QuotaState` |

## Teams — `teamRouter`

| Procedure | Type | Auth | Input | Output |
|---|---|---|---|---|
| `team.list` | query | session | none | `Team[]` |
| `team.create` | mutation | session | `{ name: string }` | `Team` |
| `team.read` | query | session | `{ id: string }` | `Team & { members: Member[] }` |
| `team.update` | mutation | session | `{ id: string, name?: string }` | `Team` |
| `team.delete` | mutation | session | `{ id: string }` | `{ success: true }` |
| `team.invite` | mutation | session | `{ id: string, email: string, role: TeamRole }` | `{ success: true }` |
| `team.removeMember` | mutation | session | `{ id: string, userId: string }` | `{ success: true }` |
| `team.changeRole` | mutation | session | `{ id: string, userId: string, role: TeamRole }` | `{ success: true }` |

## Integrations — `integrationRouter`

| Procedure | Type | Auth | Input | Output |
|---|---|---|---|---|
| `integration.list` | query | session | none | `Integration[]` |
| `integration.connect` | mutation | session | `{ provider: 'github' \| 'gitlab' \| 'vercel' | 'netlify', config: Record<string, string> }` | `Integration` |
| `integration.disconnect` | mutation | session | `{ id: string }` | `{ success: true }` |
| `integration.test` | mutation | session | `{ id: string }` | `{ ok: boolean, latencyMs: number }` |

## Admin — `adminRouter`

All procedures require `role: 'admin'`.

| Procedure | Type | Input | Output |
|---|---|---|---|
| `admin.users` | query | `{ page?: number, limit?: number, search?: string }` | `{ items: User[], total: number }` |
| `admin.suspendUser` | mutation | `{ userId: string, reason: string }` | `{ success: true }` |
| `admin.unsuspendUser` | mutation | `{ userId: string }` | `{ success: true }` |
| `admin.systemStats` | query | none | `{ users: number, projects: number, deploys: number, mrr: number }` |
| `admin.auditLog` | query | `{ page?: number, limit?: number }` | `{ items: AuditEntry[], total: number }` |

## AI — `aiRouter`

| Procedure | Type | Auth | Input | Output |
|---|---|---|---|---|
| `ai.chat` | mutation | session | `{ projectId: string, message: string, model?: ModelId }` | `Stream<ChatChunk>` (SSE) |
| `ai.generate` | mutation | session | `{ projectId: string, prompt: string, kind: 'component' \| 'page' | 'route' }` | `{ files: File[] }` |
| `ai.explain` | query | session | `{ projectId: string, fileId: string }` | `{ explanation: string }` |
| `ai.quota` | query | session | none | `{ used: number, total: number, resetAt: string }` |

`ModelId` is one of: `'claude-sonnet-4-6' | 'claude-haiku-4-5' | 'gpt-4o' | 'gpt-4o-mini' | 'gemini-2.0-flash' | 'deepseek-chat'`.

## Screenshot — `screenshotRouter`

| Procedure | Type | Auth | Input | Output |
|---|---|---|---|---|
| `screenshot.create` | mutation | session | `{ projectId: string, viewport?: { width: number, height: number } }` | `{ id: string, status: 'queued' }` |
| `screenshot.read` | query | session | `{ id: string }` | `{ id: string, url: string, status: 'queued' | 'rendering' | 'done' | 'failed' }` |

## Errors

Standard TRPCError codes. The frontend maps them to user-friendly toasts.

| Code | When |
|---|---|
| `UNAUTHORIZED` | No session |
| `FORBIDDEN` | Session present, role insufficient |
| `BAD_REQUEST` | Zod validation failed |
| `NOT_FOUND` | Resource does not exist or not visible to caller |
| `CONFLICT` | Unique constraint, duplicate, etc. |
| `TOO_MANY_REQUESTS` | Rate limit hit |
| `INTERNAL_SERVER_ERROR` | Unexpected (logged to Sentry) |

## Rate limits

| Endpoint | Limit |
|---|---|
| `auth.*` (sign-in / OTP) | 10 / 5 min / IP |
| `ai.chat` | 60 / hour / user (Free), 600 / hour / user (Pro) |
| `ai.generate` | 30 / hour / user (Free), 300 / hour / user (Pro) |
| `deploy.start` | 30 / hour / user |
| All other mutations | 120 / minute / user |
| All other queries | 600 / minute / user |
