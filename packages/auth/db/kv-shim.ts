/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * kv-shim.ts
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

import type { Redis as RedisClient } from 'ioredis'

/**
 * Redis-backed drop-in for the Cloudflare KVNamespace surface this codebase
 * actually uses (get/put/delete/list with a key prefix). Lets self-hosted
 * deploys reuse createKVStorage() from @libra/better-auth-cloudflare and the
 * subscription plan-limits cache without touching either call site.
 */
export class RedisKv {
  constructor(private readonly client: RedisClient) {}

  async get(key: string): Promise<string | null> {
    return this.client.get(key)
  }

  async put(
    key: string,
    value: string,
    options?: { expirationTtl?: number }
  ): Promise<void> {
    if (options?.expirationTtl) {
      await this.client.set(key, value, 'EX', options.expirationTtl)
    } else {
      await this.client.set(key, value)
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key)
  }

  async list(options?: { prefix?: string }): Promise<{ keys: { name: string }[] }> {
    const pattern = options?.prefix ? `${options.prefix}*` : '*'
    const keys: string[] = []
    let cursor = '0'
    do {
      const [nextCursor, batch] = await this.client.scan(cursor, 'MATCH', pattern, 'COUNT', 100)
      cursor = nextCursor
      keys.push(...batch)
    } while (cursor !== '0')
    return { keys: keys.map((name) => ({ name })) }
  }
}

let sharedRedisKvPromise: Promise<RedisKv> | null = null

export function getRedisKv(): Promise<RedisKv> {
  if (!sharedRedisKvPromise) {
    sharedRedisKvPromise = (async () => {
      const redisUrl = process.env.REDIS_URL
      if (!redisUrl) {
        throw new Error('REDIS_URL is required when SELF_HOSTED=true')
      }
      const { default: IORedis } = await import('ioredis')
      return new RedisKv(new IORedis(redisUrl))
    })()
  }
  return sharedRedisKvPromise
}
