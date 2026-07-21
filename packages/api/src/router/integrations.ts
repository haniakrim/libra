/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * integrations.ts
 * Copyright (C) 2025 Nextify Limited
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 */

import { Composio } from '@composio/core'
import { composioConnection } from '@libra/db/schema/composio-schema'
import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod/v4'
import { createTRPCRouter, organizationProcedure } from '../trpc'
import { getBusinessDb } from '../utils/project'

// Curated set of Composio toolkits surfaced in the dashboard. Composio hosts
// 1000+ toolkits total; each needs its own auth config, so we start with a
// dev-relevant set rather than the full catalog.
const CURATED_TOOLKITS = [
  {
    slug: 'slack',
    name: 'Slack',
    description: 'Send messages and notifications to Slack channels.',
  },
  { slug: 'notion', name: 'Notion', description: 'Sync docs, tasks, and notes with Notion.' },
  { slug: 'linear', name: 'Linear', description: 'Create and track issues in Linear.' },
  { slug: 'discord', name: 'Discord', description: 'Post updates to Discord servers.' },
  {
    slug: 'googledrive',
    name: 'Google Drive',
    description: 'Read and write files in Google Drive.',
  },
  { slug: 'gmail', name: 'Gmail', description: 'Send and read email through Gmail.' },
  { slug: 'jira', name: 'Jira', description: 'Create and manage Jira issues.' },
  { slug: 'trello', name: 'Trello', description: 'Manage Trello boards and cards.' },
] as const

const toolkitSlugSchema = z.object({
  toolkitSlug: z.enum(CURATED_TOOLKITS.map((t) => t.slug) as [string, ...string[]]),
})

function getComposioClient(): Composio {
  const apiKey = process.env['COMPOSIO_API_KEY']
  if (!apiKey) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Composio integration is not configured',
    })
  }
  return new Composio({ apiKey })
}

// Auth configs are Composio-managed OAuth apps scoped to a toolkit, shared
// across every organization that connects it — reuse an existing one before
// creating a new one.
async function getOrCreateAuthConfigId(composio: Composio, toolkitSlug: string): Promise<string> {
  const existing = await composio.authConfigs.list({
    toolkit: toolkitSlug,
    isComposioManaged: true,
    limit: 1,
  })
  const found = existing.items[0]
  if (found) {
    return found.id
  }
  const created = await composio.authConfigs.create(toolkitSlug)
  return created.id
}

export const integrationsRouter = createTRPCRouter({
  list: organizationProcedure.query(async ({ ctx }) => {
    const db = await getBusinessDb()
    const rows = await db
      .select()
      .from(composioConnection)
      .where(eq(composioConnection.organizationId, ctx.orgId))

    const byToolkit = new Map(rows.map((row) => [row.toolkitSlug, row]))

    return CURATED_TOOLKITS.map((toolkit) => ({
      ...toolkit,
      status: byToolkit.get(toolkit.slug)?.status ?? 'NOT_CONNECTED',
    }))
  }),

  connect: organizationProcedure.input(toolkitSlugSchema).mutation(async ({ ctx, input }) => {
    const composio = getComposioClient()
    const authConfigId = await getOrCreateAuthConfigId(composio, input.toolkitSlug)

    const baseUrl = process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000'
    const callbackUrl = `${baseUrl}/dashboard/integrations`

    const connectionRequest = await composio.connectedAccounts.link(ctx.orgId, authConfigId, {
      callbackUrl,
      allowMultiple: true,
    })

    if (!connectionRequest.redirectUrl) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Composio did not return a redirect URL for this connection',
      })
    }

    const db = await getBusinessDb()
    await db
      .insert(composioConnection)
      .values({
        organizationId: ctx.orgId,
        toolkitSlug: input.toolkitSlug,
        authConfigId,
        connectedAccountId: connectionRequest.id,
        status: 'INITIATED',
      })
      .onConflictDoUpdate({
        target: [composioConnection.organizationId, composioConnection.toolkitSlug],
        set: {
          authConfigId,
          connectedAccountId: connectionRequest.id,
          status: 'INITIATED',
        },
      })

    return { redirectUrl: connectionRequest.redirectUrl as string }
  }),

  checkStatus: organizationProcedure.input(toolkitSlugSchema).mutation(async ({ ctx, input }) => {
    const db = await getBusinessDb()
    const [row] = await db
      .select()
      .from(composioConnection)
      .where(
        and(
          eq(composioConnection.organizationId, ctx.orgId),
          eq(composioConnection.toolkitSlug, input.toolkitSlug)
        )
      )
      .limit(1)

    if (!row?.connectedAccountId) {
      return { status: 'NOT_CONNECTED' as const }
    }

    const composio = getComposioClient()
    const account = await composio.connectedAccounts.get(row.connectedAccountId)

    if (account.status !== row.status) {
      await db
        .update(composioConnection)
        .set({ status: account.status })
        .where(eq(composioConnection.id, row.id))
    }

    return { status: account.status }
  }),

  disconnect: organizationProcedure.input(toolkitSlugSchema).mutation(async ({ ctx, input }) => {
    const db = await getBusinessDb()
    const [row] = await db
      .select()
      .from(composioConnection)
      .where(
        and(
          eq(composioConnection.organizationId, ctx.orgId),
          eq(composioConnection.toolkitSlug, input.toolkitSlug)
        )
      )
      .limit(1)

    if (row?.connectedAccountId) {
      const composio = getComposioClient()
      await composio.connectedAccounts.delete(row.connectedAccountId).catch(() => {
        // Already deleted on Composio's side — proceed to clean up our record.
      })
    }

    if (row) {
      await db.delete(composioConnection).where(eq(composioConnection.id, row.id))
    }

    return { success: true }
  }),
})
