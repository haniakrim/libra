/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * migrate-selfhost.ts
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

/**
 * Applies the auth SQLite migrations (packages/auth/db/migrations, same
 * dialect as the D1 schema) to the local file used by SELF_HOSTED=true
 * deploys. Run once from the container entrypoint before `next start`.
 */
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main() {
  const dbPath = process.env.AUTH_DB_PATH
  if (!dbPath) {
    throw new Error('AUTH_DB_PATH is required to run auth migrations')
  }
  const sqlite = new Database(dbPath)
  const db = drizzle(sqlite)
  migrate(db, { migrationsFolder: join(__dirname, 'migrations') })
  sqlite.close()
  console.log(`[migrate-selfhost] applied auth migrations to ${dbPath}`)
}

main().catch((error) => {
  console.error('[migrate-selfhost] failed:', error)
  process.exit(1)
})
