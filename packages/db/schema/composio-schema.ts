/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * composio-schema.ts
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

import { createId } from '@paralleldrive/cuid2'
import { sql } from 'drizzle-orm'
import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

// One connected third-party integration (via Composio) per organization per
// toolkit. authConfigId is Composio's per-toolkit, Composio-managed OAuth
// config — shared across all organizations connecting that toolkit, so it's
// stored here for convenience rather than in its own table.
export const composioConnection = pgTable(
  'composio_connection',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    organizationId: text('organization_id').notNull(),
    toolkitSlug: text('toolkit_slug').notNull(),
    authConfigId: text('auth_config_id').notNull(),
    connectedAccountId: text('connected_account_id'),
    status: text('status').notNull().default('INITIATED'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).default(
      sql`CURRENT_TIMESTAMP`
    ),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    uniqueOrgToolkit: uniqueIndex('composio_connection_org_toolkit_idx').on(
      table.organizationId,
      table.toolkitSlug
    ),
  })
)
