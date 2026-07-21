/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * faq-disclosure.tsx
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

import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

interface FaqDisclosureItem {
  id: string
  trigger: ReactNode
  content: ReactNode
}

// Native <details>/<summary> accordion — accessible by default, no extra
// dependency (packages/ui's accordion.tsx is an empty stub).
export function FaqDisclosureList({ items }: { items: FaqDisclosureItem[] }) {
  return (
    <div className='glass-1 divide-y divide-border/60 rounded-2xl px-2'>
      {items.map((item) => (
        <details key={item.id} className='group px-4 py-2'>
          <summary className='flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-start text-base font-medium marker:content-none'>
            {item.trigger}
            <ChevronDown className='h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180' />
          </summary>
          <div className='text-muted-foreground pb-4 leading-relaxed'>{item.content}</div>
        </details>
      ))}
    </div>
  )
}
