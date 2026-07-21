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
import { Clock, Mail, MessageCircle } from 'lucide-react'
import { headers } from 'next/headers'
import Footer from '@/components/marketing/footer'
import Navbar from '@/components/marketing/nav'
import { NabdHero } from '@/components/nabd/nabd-hero'
import { SupportForm } from './support-form'

export default async function SupportPage() {
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
      <NabdHero
        eyebrow='Support'
        title='Talk to Nabd Agentic OS support'
        description="Stuck on something, hit a bug, or have a question about your plan? Send us a message and we'll get back to you."
      />

      <div className='mx-auto grid max-w-5xl grid-cols-1 gap-12 px-4 py-16 md:grid-cols-5 md:px-6 lg:gap-16'>
        <div className='md:col-span-3'>
          <SupportForm />
        </div>

        <div className='flex flex-col gap-6 md:col-span-2'>
          <div className='glass-1 flex flex-col gap-4 rounded-2xl p-8 shadow-lg'>
            <h3 className='flex items-center gap-2 text-xl font-semibold'>
              <Clock className='h-5 w-5 text-nabd-accent-2' />
              Response times
            </h3>
            <ul className='text-muted-foreground flex flex-col gap-2 text-sm'>
              <li>General questions and bugs — within 1 business day</li>
              <li>Billing and account issues — within 4 hours on business days</li>
              <li>Critical outages on paid plans — best-effort, as soon as we see it</li>
            </ul>
          </div>

          <div className='glass-1 flex flex-col gap-4 rounded-2xl p-8 shadow-lg'>
            <h3 className='flex items-center gap-2 text-xl font-semibold'>
              <Mail className='h-5 w-5 text-brand' />
              Other ways to reach us
            </h3>
            <p className='text-muted-foreground text-sm'>
              For anything urgent, or if you'd rather not use the form, email us directly and
              include your account email and organization name.
            </p>
          </div>

          <div className='glass-1 flex flex-col gap-4 rounded-2xl p-8 shadow-lg'>
            <h3 className='flex items-center gap-2 text-xl font-semibold'>
              <MessageCircle className='h-5 w-5 text-brand' />
              Before you write in
            </h3>
            <p className='text-muted-foreground text-sm'>
              Check the{' '}
              <a href='/help' className='text-brand hover:underline'>
                Help Center
              </a>{' '}
              and{' '}
              <a href='/docs/faq' className='text-brand hover:underline'>
                Docs FAQ
              </a>{' '}
              — many common questions are answered there instantly.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
