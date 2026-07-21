/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * next.config.mjs
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

import { fileURLToPath } from "node:url";
import { paraglideWebpackPlugin } from "@inlang/paraglide-js";
import {initOpenNextCloudflareForDev} from "@opennextjs/cloudflare";

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`.
// Self-hosted (Docker/VPS) never uses getCloudflareContext(), and this spawns
// a wrangler subprocess that writes logs to $HOME — which the container's
// non-root runtime user doesn't have, crashing `next start` on boot.
if (process.env.SELF_HOSTED !== 'true') {
    initOpenNextCloudflareForDev();
}

// Dynamic import for bundle analyzer to handle ESM/CommonJS compatibility
const withBundleAnalyzer = (await import('@next/bundle-analyzer')).default({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Self-hosted Docker build already gates on a separate `tsc --noEmit` +
    // lint pass before the image builds — skip Next's redundant in-build
    // type-check/lint here, which otherwise doubles build time/memory on
    // constrained hosts. Cloudflare/OpenNext build path is untouched.
    ...(process.env.SELF_HOSTED === 'true' ? {
        typescript: { ignoreBuildErrors: true },
        eslint: { ignoreDuringBuilds: true },
    } : {}),
    reactStrictMode: true,
    transpilePackages: ["@libra/ui", "@libra/auth", "@libra/db", "@libra/api", "@libra/common"
        , "@libra/better-auth-cloudflare", "@libra/email","@libra/better-auth-stripe","@libra/shikicode"
    ,"@libra/sandbox"],
    pageExtensions: ['ts', 'tsx'],
    experimental: {
        reactCompiler: true,
        useCache: true,
        // ppr: true,
    },
    images: {
      loader: 'custom',
      loaderFile: './imageLoader.ts',
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '3004',
          pathname: '/image/**',
        },
        {
            protocol: 'https',
            hostname: 'cdn.libra.agentic-lab.io',
            pathname: '/image/**',
        }
      ],
    },
    webpack: (config) => {
        config.plugins.push(
            paraglideWebpackPlugin({
                outdir: "./paraglide",
                project: "./project.inlang",
                strategy: ["cookie", "baseLocale"],
                experimentalMiddlewareLocaleSplitting: false,
                // Set cookie domain for subdomain sharing in staging/production
                cookieDomain: process.env.NODE_ENV === 'production' ? '.libra.agentic-lab.io' : 'localhost'
            })
    		);

    		// The Cloudflare/OpenNext build target never runs self-hosted, so
    		// force @libra/auth/db to its "workerd" variant here too — package.json
    		// exports conditions only take effect for opennextjs-cloudflare's
    		// second-pass esbuild bundling, which runs on already-webpack-flattened
    		// output where the 'bun:sqlite' import is already inlined as a literal
    		// require. This alias makes webpack (the first pass) pick the
    		// bun:sqlite-free file, so it's never in the graph at either stage.
    		if (process.env.SELF_HOSTED !== 'true') {
    			config.resolve.alias['@libra/auth/db$'] = fileURLToPath(
    				new URL('../../packages/auth/db/index.workerd.ts', import.meta.url)
    			);
    		}

    		return config;
    },
    serverExternalPackages: ["@prisma/client", ".prisma/client", "postgres", "@libsql/isomorphic-ws", "jose", "ioredis"],
}

export default withBundleAnalyzer(nextConfig)
