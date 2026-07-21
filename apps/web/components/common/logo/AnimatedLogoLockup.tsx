/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * AnimatedLogoLockup.tsx
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

import { cn } from '@libra/ui/lib/utils'

interface AnimatedLogoLockupProps {
  className?: string
  iconClassName?: string
  textClassName?: string
}

// Icon and wordmark share the same `logo-gradient-bg` utility (defined in
// packages/ui/src/styles/utils.css) so both animate with identical colors
// and timing — the icon shows it through a CSS mask of the Libra glyph,
// the text through `background-clip: text`.
export function AnimatedLogoLockup({
  className,
  iconClassName,
  textClassName,
}: AnimatedLogoLockupProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div
        aria-hidden
        className={cn('logo-gradient-bg h-8 w-8 shrink-0', iconClassName)}
        style={{
          WebkitMaskImage: 'url(/images/brand/libra-icon-mask.svg)',
          maskImage: 'url(/images/brand/libra-icon-mask.svg)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      />
      <span
        className={cn(
          'logo-gradient-bg bg-clip-text text-2xl font-bold font-sansTight text-transparent sm:text-3xl lg:text-4xl',
          textClassName
        )}
      >
        Libra AI
      </span>
    </div>
  )
}
