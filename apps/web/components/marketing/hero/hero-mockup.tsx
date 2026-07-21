/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * hero-mockup.tsx
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

import Glow from '@libra/ui/components/glow'
import { Mockup, MockupFrame } from '@libra/ui/components/mockup'
import type { ReactNode } from 'react'
import { memo } from 'react'
import { HeroAppPreview } from './components/hero-app-preview'

interface HeroMockupProps {
  mockup?: ReactNode | false
}

/**
 * Default app preview — a themed component (not a raster screenshot) so
 * its colors come from the shared design tokens and stay in sync with
 * theme changes automatically.
 */
const defaultMockup = <HeroAppPreview />

/**
 * Bottom app showcase area of the Hero component
 */
export const HeroMockup = memo(({ mockup = defaultMockup }: HeroMockupProps) => {
  if (mockup === false) {
    return null
  }

  return (
    <div className='relative w-full pt-8 sm:pt-10 md:pt-12 translate-z-0'>
      <MockupFrame className='animate-appear opacity-0 delay-700 translate-z-0' size='small'>
        <Mockup
          type='responsive'
          className='bg-[var(--background-landing)]/90 w-full rounded-xl border-0'
        >
          {mockup}
        </Mockup>
      </MockupFrame>
      <div
        className='pointer-events-none absolute inset-x-0 top-0 z-[5] hidden h-1/2 bg-gradient-to-b from-[var(--background-landing)]/35 to-transparent dark:block'
        aria-hidden='true'
      />
      <div
        className='pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-[var(--background-landing)] via-[var(--background-landing)]/80 to-transparent dark:h-2/3 dark:via-[var(--background-landing)]/90'
        aria-hidden='true'
      />
      <Glow variant='top' className='animate-appear-zoom opacity-0 delay-1000 translate-z-0' />
    </div>
  )
})
