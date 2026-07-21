/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * docs-shell.tsx
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

'use client'

import { cn } from '@libra/ui/lib/utils'
import { Languages } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useDocsLanguage } from '@/components/nabd/docs-language-context'
import { DOCS_CONTENT } from '@/lib/docs-content'

const NAV_ITEMS: { key: keyof typeof DOCS_CONTENT.en.nav; href: string }[] = [
  { key: 'gettingStarted', href: '/docs/getting-started' },
  { key: 'features', href: '/docs/features' },
  { key: 'guides', href: '/docs/guides' },
  { key: 'faq', href: '/docs/faq' },
]

export function DocsShell({ children }: { children: ReactNode }) {
  const { locale, setLocale } = useDocsLanguage()
  const pathname = usePathname()
  const nav = DOCS_CONTENT[locale].nav
  const isRtl = locale === 'ar'

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className='mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:px-6'
    >
      <aside className='shrink-0 md:w-56'>
        <div className='sticky top-24 flex flex-col gap-4'>
          <button
            type='button'
            onClick={() => setLocale(isRtl ? 'en' : 'ar')}
            className='flex items-center gap-2 self-start rounded-full border border-nabd-accent-2/30 bg-nabd-accent-2/10 px-3 py-1.5 text-xs font-medium text-nabd-accent-2 transition-colors hover:bg-nabd-accent-2/20'
          >
            <Languages className='h-3.5 w-3.5' />
            {isRtl ? 'English' : 'العربية'}
          </button>

          <nav className='flex flex-row gap-1 overflow-x-auto md:flex-col md:overflow-visible'>
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'shrink-0 rounded-lg px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-brand/10 font-medium text-brand'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {nav[item.key]}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      <div className='min-w-0 flex-1'>{children}</div>
    </div>
  )
}
