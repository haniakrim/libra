/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * index.ts
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

import {getCloudflareContext} from "@opennextjs/cloudflare";
import {drizzle} from "drizzle-orm/d1";
import type {DrizzleD1Database} from "drizzle-orm/d1";
import {isSelfHosted} from "@libra/common";
import {schema} from "./schema";
import {getRedisKv} from "./kv-shim";

export async function getCache() {
    if (isSelfHosted()) {
        return getRedisKv();
    }
    // Retrieves Cloudflare-specific context, including environment variables and bindings
    const {env} = await getCloudflareContext({async: true});
    return (env as any).CACHE;
}

// Return type is pinned to the D1 shape so callers (e.g. packages/api routers)
// see one stable type regardless of runtime backend. The self-hosted SQLite
// instance supports the same query-builder surface used anywhere in this
// codebase (select/insert/update/where/...) — it only lacks D1's `batch()`,
// which nothing here calls.
export async function getAuthDb(): Promise<DrizzleD1Database<typeof schema>> {
    // Determine environment: disable logger in production, enable in non-production
    const isProduction = (process.env['ENVIRONMENT'] as string) === 'production';

    if (isSelfHosted()) {
        const dbPath = process.env.AUTH_DB_PATH;
        if (!dbPath) {
            throw new Error('AUTH_DB_PATH is required when SELF_HOSTED=true');
        }
        // bun:sqlite is Bun's built-in SQLite driver — better-sqlite3's native
        // addon does not load under Bun (dlopen refuses; see
        // https://github.com/oven-sh/bun/issues/4290), so this is the
        // supported path for a Bun runtime rather than a preference.
        const { Database } = await import('bun:sqlite');
        const { drizzle: drizzleSqlite } = await import('drizzle-orm/bun-sqlite');
        const db = drizzleSqlite(new Database(dbPath), { schema, logger: !isProduction });
        return db as unknown as DrizzleD1Database<typeof schema>;
    }

    // Retrieves Cloudflare-specific context, including environment variables and bindings
    const {env} = await getCloudflareContext({async: true});

    // Initialize Drizzle with your D1 binding (e.g., "DB" or "DATABASE" from wrangler.toml)
    return drizzle((env as any).DATABASE, {
        // Ensure "DATABASE" matches your D1 binding name in wrangler.jsonc
        schema,
        logger: !isProduction,
    });
}

// Re-export the drizzle-orm types and utilities from here for convenience
export * from "drizzle-orm";

// Re-export the feature schemas for use in other files
export * from "./schema/auth-schema";
export * from "./schema/plan-schema";
export * from "./schema/price-schema";
export * from "./schema/github-schema";
export * from "./schema";