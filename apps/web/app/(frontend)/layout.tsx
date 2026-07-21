/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * layout.tsx
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

import { headers } from 'next/headers'
import type React from 'react'
import { cache, Suspense } from 'react'
import {
  assertIsLocale,
  baseLocale,
  getLocale,
  type Locale,
  overwriteGetLocale,
  overwriteGetUrlOrigin,
} from '../../paraglide/runtime'
import './fonts'
import '@libra/ui/globals.css'
import { Toaster } from '@libra/ui/components/sonner'
import type { Metadata } from 'next/types'
import { ThemeProvider } from 'next-themes'
import ClientProviders from '@/components/client-providers'
import { GeneralAnalyticsCollector } from '@/components/general-analytics-collector'
import { GoogleAnalytics } from '@/components/google-analytics'
import { siteConfig } from '@/configs/site'
import { TRPCReactProvider } from '@/trpc/client'
import { Body } from './layout.client'

const ssrLocale = cache(() => ({ locale: baseLocale, origin: 'http://localhost' }))

// overwrite the getLocale function to use the locale from the request
overwriteGetLocale(() => {
  const store = ssrLocale()
  const locale = store.locale
  // Ensure we always return a valid locale, fallback to baseLocale
  return assertIsLocale(locale || baseLocale)
})
overwriteGetUrlOrigin(() => ssrLocale().origin)

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: [
    'AI development platform',
    'no-code development',
    'low-code platform',
    'AI code generation',
    'natural language programming',
    'full-stack development',
    'web application builder',
    'AI-powered coding',
    'cloud IDE',
    'real-time collaboration',
    'Next.js',
    'React',
    'TypeScript',
    'serverless deployment',
    'Cloudflare Workers',
    'SaaS platform',
    'developer tools',
    'code editor',
    'project management',
    'team collaboration',
    'AI assistant',
    'automated deployment',
    'modern web development',
    'enterprise development',
    'subscription management',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@nextify2024',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const localeFromHeader = headersList.get('x-paraglide-locale') as Locale
  const requestUrl = headersList.get('x-paraglide-request-url') || 'http://localhost'

  // Ensure we have a valid locale, fallback to baseLocale if needed
  let validLocale = baseLocale
  try {
    if (localeFromHeader) {
      validLocale = assertIsLocale(localeFromHeader)
    }
  } catch {
    // If locale validation fails, use baseLocale
    validLocale = baseLocale
  }

  ssrLocale().locale = validLocale
  ssrLocale().origin = new URL(requestUrl).origin
  const locale = getLocale()
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* next-themes 0.4.6 injects a minified inline script that references an
            undefined helper `e` in production builds. Keep this as the very first
            inline script so the helper is defined before any theme script runs. */}
        <script
          id='e-polyfill'
          dangerouslySetInnerHTML={{
            __html: "if (typeof e === 'undefined') { var e = function () {} }",
          }}
        />
        <GoogleAnalytics />
      </head>
      <Body>
        <ClientProviders>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </ThemeProvider>
          <Suspense>
            <GeneralAnalyticsCollector />
            <Toaster />
          </Suspense>
        </ClientProviders>
      </Body>
    </html>
  )
}
