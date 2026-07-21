/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * nabd-hero.tsx
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

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface NabdHeroProps {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
}

// Shared "Nabd Agentic OS" section header — cyan/pink accent duo over the
// dedicated Nabd palette, used by docs/support/help.
export function NabdHero({ eyebrow, title, description, actions }: NabdHeroProps) {
  return (
    <div className='relative overflow-hidden border-b border-border/60'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-40'
        style={{
          background:
            'radial-gradient(60% 80% at 15% 0%, color-mix(in oklch, var(--nabd-accent-2) 18%, transparent), transparent), radial-gradient(50% 70% at 85% 20%, color-mix(in oklch, var(--nabd-accent) 16%, transparent), transparent)',
        }}
      />
      <div className='relative mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16 text-center md:px-6 md:py-24'>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='mx-auto flex items-center gap-2 rounded-full border border-nabd-accent-2/30 bg-nabd-accent-2/10 px-4 py-1.5 text-xs font-medium tracking-wide text-nabd-accent-2 uppercase'
        >
          <span className='inline-block h-1.5 w-1.5 rounded-full bg-nabd-accent-2' />
          Nabd Agentic OS
          <span className='text-muted-foreground normal-case'>· {eyebrow}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          className='text-4xl font-bold leading-tight sm:text-5xl'
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className='text-muted-foreground mx-auto max-w-2xl text-lg'
        >
          {description}
        </motion.p>

        {actions && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className='mx-auto flex flex-wrap items-center justify-center gap-3'
          >
            {actions}
          </motion.div>
        )}
      </div>
    </div>
  )
}
