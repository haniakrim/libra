/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * docs-faq-view.tsx
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

import { useDocsLanguage } from '@/components/nabd/docs-language-context'
import { FaqDisclosureList } from '@/components/nabd/faq-disclosure'
import { DOCS_CONTENT } from '@/lib/docs-content'

export function DocsFaqView() {
  const { locale } = useDocsLanguage()
  const { title, description, entries } = DOCS_CONTENT[locale].faq

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <h2 className='text-2xl font-bold sm:text-3xl'>{title}</h2>
        <p className='text-muted-foreground mt-2 text-lg'>{description}</p>
      </div>

      <FaqDisclosureList
        items={entries.map((entry, index) => ({
          id: `faq-${index}`,
          trigger: entry.question,
          content: entry.answer,
        }))}
      />
    </div>
  )
}
