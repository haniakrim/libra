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

import { initAuth } from '@libra/auth/auth-server'
import { headers } from 'next/headers'
import type { ReactNode } from 'react'
import Footer from '@/components/marketing/footer'
import Navbar from '@/components/marketing/nav'
import { DocsLanguageProvider } from '@/components/nabd/docs-language-context'
import { DocsShell } from '@/components/nabd/docs-shell'
import { NabdHero } from '@/components/nabd/nabd-hero'

export default async function DocsLayout({ children }: { children: ReactNode }) {
  let isAuthenticated = false
  try {
    const auth = await initAuth()
    const headersList = await headers()
    const session = await auth.api.getSession({ headers: headersList })
    isAuthenticated = !!session?.user
  } catch {
    isAuthenticated = false
  }

  return (
    <main className='nabd-theme dark min-h-screen w-full overflow-hidden bg-[var(--background-landing)] text-[var(--foreground-landing)]'>
      <Navbar isAuthenticated={isAuthenticated} />
      <DocsLanguageProvider>
        <NabdHero
          eyebrow='Documentation'
          title='Everything you need to build with Nabd Agentic OS'
          description='Getting started, features, guides, and answers to common questions — in English and Arabic.'
        />
        <DocsShell>{children}</DocsShell>
      </DocsLanguageProvider>
      <Footer />
    </main>
  )
}
