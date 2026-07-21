/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * page.tsx
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
import Footer from '@/components/marketing/footer'
import Navbar from '@/components/marketing/nav'
import { NabdHero } from '@/components/nabd/nabd-hero'
import { HelpSearch } from './help-search'

export default async function HelpPage() {
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
    <main className='min-h-screen w-full overflow-hidden bg-[var(--background-landing)] text-[var(--foreground-landing)]'>
      <Navbar isAuthenticated={isAuthenticated} />
      <NabdHero
        eyebrow='Help Center'
        title='Find answers fast'
        description='Search troubleshooting steps and common questions, or reach out if you need more help.'
      />
      <div className='mx-auto max-w-3xl px-4 py-16 md:px-6'>
        <HelpSearch />
      </div>
      <Footer />
    </main>
  )
}
