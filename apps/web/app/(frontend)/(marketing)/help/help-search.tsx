/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * help-search.tsx
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

import { Input } from '@libra/ui/components/input'
import { cn } from '@libra/ui/lib/utils'
import { Search } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { FaqDisclosureList } from '@/components/nabd/faq-disclosure'
import { HELP_ARTICLES, HELP_CATEGORIES, type HelpArticle } from '@/lib/help-content'

export function HelpSearch() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<HelpArticle['category'] | 'All'>('All')

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return HELP_ARTICLES.filter((article) => {
      const matchesCategory = activeCategory === 'All' || article.category === activeCategory
      if (!matchesCategory) return false
      if (!normalized) return true
      return (
        article.question.toLowerCase().includes(normalized) ||
        article.answer.toLowerCase().includes(normalized)
      )
    })
  }, [query, activeCategory])

  return (
    <div className='flex flex-col gap-8'>
      <div className='relative'>
        <Search className='pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='Search articles — e.g. "quota", "GitHub", "domain"'
          className='h-12 rounded-full pl-11 text-base'
        />
      </div>

      <div className='flex flex-wrap gap-2'>
        {(['All', ...HELP_CATEGORIES] as const).map((category) => (
          <button
            key={category}
            type='button'
            onClick={() => setActiveCategory(category)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
              activeCategory === category
                ? 'border-brand/40 bg-brand/10 font-medium text-brand'
                : 'border-border text-muted-foreground hover:bg-muted'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <div className='glass-1 rounded-2xl p-8 text-center'>
          <p className='text-muted-foreground'>
            No articles match "{query}". Try a different search, or{' '}
            <a href='/support' className='text-brand hover:underline'>
              contact support
            </a>
            .
          </p>
        </div>
      ) : (
        <motion.div layout>
          <FaqDisclosureList
            items={results.map((article) => ({
              id: article.id,
              trigger: (
                <span className='flex flex-col items-start gap-1'>
                  <span className='text-xs font-normal text-gold'>{article.category}</span>
                  {article.question}
                </span>
              ),
              content: article.answer,
            }))}
          />
        </motion.div>
      )}
    </div>
  )
}
