/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * bun-sqlite.d.ts
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

/**
 * Minimal ambient shape for Bun's built-in 'bun:sqlite' module, scoped to
 * exactly the files that reference it (via triple-slash reference) rather
 * than pulling the full @types/bun global environment into every consuming
 * package's tsconfig — several of those (apps/deploy, apps/dispatcher, ...)
 * pin an explicit "types" array for @cloudflare/workers-types and would
 * otherwise collide with Bun's global augmentations (fetch, Request, ...).
 */
declare module 'bun:sqlite' {
  export class Database {
    constructor(filename?: string, options?: unknown)
    close(): void
  }
}
