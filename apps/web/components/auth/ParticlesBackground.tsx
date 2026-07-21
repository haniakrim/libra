/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * ParticlesBackground.tsx
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

import { useTheme } from 'next-themes'
import { memo } from 'react'
import { SparklesCore } from '@/components/ui/sparkles'

/**
 * A memoized particles background component
 * Uses 3D particle animation for visual effect
 */
const ParticlesBackground = memo(() => {
  const { resolvedTheme } = useTheme()

  // Dynamic particle color based on theme — dark mode matches the Tron
  // OS neon-cyan brand token (--primary: oklch(85% 0.15 200) = #00EAF4)
  const particleColor = resolvedTheme === 'dark' ? '#00EAF4FF' : '#3B82F6FF'

  return (
    <div className='absolute inset-0 w-full h-full z-0 overflow-hidden'>
      <SparklesCore
        background='transparent'
        minSize={0.8}
        maxSize={2.0}
        particleDensity={100}
        className='w-full h-full'
        particleColor={particleColor}
      />
    </div>
  )
})

ParticlesBackground.displayName = 'ParticlesBackground'

export default ParticlesBackground
