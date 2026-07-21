/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * selfhost.ts
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

/// <reference path="./bun-sqlite.d.ts" />

import type { DrizzleD1Database } from 'drizzle-orm/d1'
import { schema } from './schema'

// This file is only reachable from db/index.ts's default (non-"workerd")
// export condition — i.e. local dev and the self-hosted Bun/Docker build.
// The Cloudflare Workers build resolves "./db" to index.workerd.ts instead,
// which never imports this file, so opennextjs-cloudflare's esbuild bundling
// never has to statically resolve 'bun:sqlite' (it doesn't exist outside Bun).
export async function getSelfHostedAuthDb(
  dbPath: string,
  isProduction: boolean
): Promise<DrizzleD1Database<typeof schema>> {
  // bun:sqlite is Bun's built-in SQLite driver — better-sqlite3's native
  // addon does not load under Bun (dlopen refuses; see
  // https://github.com/oven-sh/bun/issues/4290), so this is the
  // supported path for a Bun runtime rather than a preference.
  const { Database } = await import('bun:sqlite')
  const { drizzle: drizzleSqlite } = await import('drizzle-orm/bun-sqlite')
  const db = drizzleSqlite(new Database(dbPath), { schema, logger: !isProduction })
  return db as unknown as DrizzleD1Database<typeof schema>
}
