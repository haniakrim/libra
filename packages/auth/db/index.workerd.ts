/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * index.workerd.ts
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

// Cloudflare Workers ("workerd" esbuild condition) build of ./db. Resolved
// instead of index.ts by opennextjs-cloudflare (useWorkerdCondition, on by
// default) via the "workerd" key in package.json's "./db" export map.
// It never imports selfhost.ts, so 'bun:sqlite' — which doesn't exist
// outside Bun — is unreachable from this build's module graph entirely,
// instead of merely unreached at runtime. Keep this file's shape in sync
// with index.ts's non-self-hosted branch.

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

export async function getAuthDb(): Promise<DrizzleD1Database<typeof schema>> {
    const isProduction = (process.env['ENVIRONMENT'] as string) === 'production';

    if (isSelfHosted()) {
        throw new Error(
            'SELF_HOSTED=true is not supported on the Cloudflare Workers deployment target'
        );
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
