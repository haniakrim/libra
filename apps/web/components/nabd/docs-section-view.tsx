/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * docs-section-view.tsx
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
import { useDocsLanguage } from '@/components/nabd/docs-language-context'
import { DOCS_CONTENT, type DocsContent } from '@/lib/docs-content'

export function DocsSectionView({
  section,
}: {
  section: 'gettingStarted' | 'features' | 'guides'
}) {
  const { locale } = useDocsLanguage()
  const content: DocsContent[typeof section] = DOCS_CONTENT[locale][section]

  return (
    <div className='flex flex-col gap-10'>
      <div>
        <h2 className='text-2xl font-bold sm:text-3xl'>{content.title}</h2>
        <p className='text-muted-foreground mt-2 text-lg'>{content.description}</p>
      </div>

      <div className='flex flex-col gap-6'>
        {content.blocks.map((block, index) => (
          <motion.div
            key={block.heading}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.05 }}
            className='glass-1 rounded-2xl p-6 shadow-sm'
          >
            <h3 className='text-lg font-semibold'>{block.heading}</h3>
            {block.body.map((paragraph) => (
              <p key={paragraph} className='text-muted-foreground mt-2 leading-relaxed'>
                {paragraph}
              </p>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
