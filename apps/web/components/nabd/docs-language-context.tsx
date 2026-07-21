/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * docs-language-context.tsx
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

import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { DocsLocale } from '@/lib/docs-content'

const STORAGE_KEY = 'nabd-docs-locale'

interface DocsLanguageContextValue {
  locale: DocsLocale
  setLocale: (locale: DocsLocale) => void
}

const DocsLanguageContext = createContext<DocsLanguageContextValue | null>(null)

export function DocsLanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<DocsLocale>('en')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'ar') {
      setLocaleState(stored)
    }
  }, [])

  const setLocale = useCallback((next: DocsLocale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-docs-dir', locale === 'ar' ? 'rtl' : 'ltr')
    return () => {
      document.documentElement.removeAttribute('data-docs-dir')
    }
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale])

  return <DocsLanguageContext.Provider value={value}>{children}</DocsLanguageContext.Provider>
}

export function useDocsLanguage(): DocsLanguageContextValue {
  const ctx = useContext(DocsLanguageContext)
  if (!ctx) {
    throw new Error('useDocsLanguage must be used within a DocsLanguageProvider')
  }
  return ctx
}
