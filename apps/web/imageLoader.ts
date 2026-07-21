/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * imageLoader.ts
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

const normalizeSrc = (src: string) => {
  return src.startsWith('/') ? src.slice(1) : src
}

export default function cloudflareLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const params = [`width=${width}`]
  if (quality) {
    params.push(`quality=${quality}`)
  }
  const paramsString = params.join(',')

  if (process.env.NODE_ENV === 'development') {
    if (process.env.CLOUDFLARE_DOMAIN) {
      return `https://${process.env.CLOUDFLARE_DOMAIN}/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`
    }
    return src
  }

  // Cloudflare Images does not support SVG; serve SVGs directly.
  if (/\.(svg|svgz)(\?.*)?$/i.test(src)) {
    return src
  }

  // Skip Cloudflare image optimization for cdn.libra.agentic-lab.io URLs
  // This prevents double processing of images already served by our CDN
  if (
    src.startsWith('https://cdn.libra.agentic-lab.io/') ||
    src.startsWith('http://cdn.libra.agentic-lab.io/')
  ) {
    return src
  }

  // Bypass Cloudflare image optimization in local wrangler dev (no /cdn-cgi/image endpoint)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
  if (appUrl.includes('localhost') || appUrl.includes('127.0.0.1')) {
    return src
  }

  // Extra guard: explicit opt-out for local wrangler dev where /cdn-cgi/image is unavailable.
  // Uses a non-public env var so .dev.vars/runtime overrides apply without needing a rebuild.
  if (process.env.DISABLE_CLOUDFLARE_IMAGE_OPTIMIZATION === 'true') {
    return src
  }

  // Legacy client-side fallback when the public env flag was inlined at build time.
  if (process.env.NEXT_PUBLIC_DISABLE_CLOUDFLARE_IMAGE_OPTIMIZATION === 'true') {
    return src
  }

  // Production environment uses relative paths for other images
  // Client-side bypass for local wrangler dev where /cdn-cgi/image is unavailable.
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return src
  }

  return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`
}
