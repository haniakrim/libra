/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * hero-app-preview.tsx
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

import { ArrowUpRight, FileCode2, Folder, Sparkles } from 'lucide-react'

const sidebarEntries = [
  { label: 'public', isFolder: true },
  { label: 'src', isFolder: true },
  { label: '.devvars.example', isFolder: false },
  { label: 'components.json', isFolder: false },
  { label: 'package.json', isFolder: false },
  { label: 'README.md', isFolder: false, active: true },
  { label: 'tsconfig.json', isFolder: false },
  { label: 'vite.config.ts', isFolder: false },
]

const codeLines: {
  indent: number
  segments: { text: string; tone: 'keyword' | 'string' | 'muted' | 'plain' }[]
}[] = [
  { indent: 0, segments: [{ text: '# Vite Shadcn Template', tone: 'keyword' }] },
  { indent: 0, segments: [] },
  {
    indent: 0,
    segments: [
      { text: 'A modern React template powered by ', tone: 'plain' },
      { text: 'Vite', tone: 'string' },
      { text: ', featuring ', tone: 'plain' },
      { text: 'Shadcn UI', tone: 'string' },
      { text: ' components.', tone: 'plain' },
    ],
  },
  { indent: 0, segments: [] },
  { indent: 0, segments: [{ text: '## Features', tone: 'keyword' }] },
  { indent: 0, segments: [{ text: '- Lightning fast frontend tooling', tone: 'muted' }] },
  { indent: 0, segments: [{ text: '- High-quality UI components', tone: 'muted' }] },
  { indent: 0, segments: [{ text: '- Type safety for your components', tone: 'muted' }] },
]

const fileChanges = [
  { name: 'TodoInput.tsx', path: 'src/components/', diff: '+55' },
  { name: 'TodoItem.tsx', path: 'src/components/', diff: '+57' },
]

const toneClass: Record<(typeof codeLines)[number]['segments'][number]['tone'], string> = {
  keyword: 'text-[var(--primary)]',
  string: 'text-[var(--accent-foreground)]',
  muted: 'text-[var(--muted-foreground)]',
  plain: 'text-[var(--foreground)]/80',
}

/**
 * Themed hero app-preview mockup — a lightweight, fully themeable stand-in
 * for a real product screenshot. Every color reads from the shared OKLCH
 * design tokens (--card, --border, --primary, ...), so it adapts to light
 * (warm brand accent) and dark (Tron neon-cyan) automatically, with no
 * baked-in raster colors to fall out of sync with theme changes.
 */
export function HeroAppPreview() {
  return (
    <div className='flex h-full w-full min-h-[420px] bg-[var(--card)] text-[11px] dark:shadow-[inset_0_0_60px_-20px_oklch(85%_0.15_200_/_0.25)]'>
      {/* File sidebar */}
      <div className='hidden w-40 shrink-0 flex-col gap-1 border-r border-[var(--border)] bg-[var(--background)]/40 p-3 sm:flex'>
        {sidebarEntries.map((entry) => (
          <div
            key={entry.label}
            className={
              entry.active
                ? 'flex items-center gap-1.5 rounded-md bg-[var(--primary)]/15 px-1.5 py-1 text-[var(--primary)] ring-1 ring-[var(--primary)]/30'
                : 'flex items-center gap-1.5 px-1.5 py-1 text-[var(--muted-foreground)]'
            }
          >
            {entry.isFolder ? (
              <Folder className='size-3 shrink-0' />
            ) : (
              <FileCode2 className='size-3 shrink-0' />
            )}
            <span className='truncate'>{entry.label}</span>
          </div>
        ))}
      </div>

      {/* README / code pane */}
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='flex items-center justify-between border-b border-[var(--border)] px-3 py-2'>
          <div className='flex items-center gap-1.5 text-[var(--foreground)]/90'>
            <FileCode2 className='size-3 text-[var(--primary)]' />
            README.md
          </div>
          <div className='hidden items-center gap-1.5 text-[var(--muted-foreground)] sm:flex'>
            <span className='h-3 w-6 rounded-full bg-[var(--border)]' />
            Edit Mode
          </div>
        </div>
        <div className='flex-1 space-y-1 overflow-hidden p-3 font-mono leading-relaxed'>
          {codeLines.map((line, i) => (
            // Static, hand-authored preview content — index is stable and safe here.
            <div key={i} className='flex gap-2'>
              <span className='select-none text-[var(--muted-foreground)]/50'>{i + 1}</span>
              <span>
                {line.segments.length === 0
                  ? ' '
                  : line.segments.map((seg, j) => (
                      <span key={j} className={toneClass[seg.tone]}>
                        {seg.text}
                      </span>
                    ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Libra AI panel */}
      <div className='hidden w-56 shrink-0 flex-col gap-3 border-l border-[var(--border)] bg-[var(--background)]/40 p-3 md:flex'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1.5 text-[var(--foreground)]/90'>
            <Sparkles className='size-3.5 text-[var(--primary)]' />
            Libra AI
          </div>
          <div className='flex items-center gap-1 rounded-md bg-[var(--primary)] px-2 py-1 font-medium text-[var(--primary-foreground)] shadow-[0_0_12px_-2px_var(--primary)]'>
            Deploy
            <ArrowUpRight className='size-3' />
          </div>
        </div>
        <div className='flex gap-1 text-[var(--muted-foreground)]'>
          <span className='rounded-md border border-[var(--border)] px-1.5 py-0.5'>Thinking</span>
          <span className='rounded-md border border-[var(--border)] px-1.5 py-0.5'>Plan</span>
          <span className='rounded-md bg-[var(--primary)]/15 px-1.5 py-0.5 text-[var(--primary)]'>
            Files
          </span>
        </div>
        <div className='flex items-center justify-between text-[var(--muted-foreground)]'>
          <span>File Changes</span>
          <span>{fileChanges.length} files</span>
        </div>
        <div className='flex flex-col gap-1.5'>
          {fileChanges.map((file) => (
            <div
              key={file.name}
              className='flex items-center justify-between rounded-md border border-[var(--border)] px-2 py-1.5'
            >
              <div className='flex min-w-0 flex-col'>
                <span className='truncate text-[var(--foreground)]/90'>{file.name}</span>
                <span className='truncate text-[var(--muted-foreground)]/70'>{file.path}</span>
              </div>
              <span className='shrink-0 text-[var(--primary)]'>{file.diff}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
