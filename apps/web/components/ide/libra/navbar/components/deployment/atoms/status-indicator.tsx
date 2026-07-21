/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * status-indicator.tsx
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

import { cn } from '@libra/ui/lib/utils'
import { AlertCircle, Check, Info, Loader2, XCircle } from 'lucide-react'
import * as m from '@/paraglide/messages'

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'loading'

interface StatusIndicatorProps {
  status: StatusType
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  text?: string
  className?: string
}

const statusConfig = {
  success: {
    icon: Check,
    colorClass: 'deployment-status-success',
  },
  warning: {
    icon: AlertCircle,
    colorClass: 'deployment-status-warning',
  },
  error: {
    icon: XCircle,
    colorClass: 'deployment-status-error',
  },
  info: {
    icon: Info,
    colorClass: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20',
  },
  loading: {
    icon: Loader2,
    colorClass: 'text-muted-foreground animate-pulse',
  },
} as const

// Called at render time (not module scope) so it reads the request's
// current locale rather than baking in whatever locale was active when
// this module first loaded.
function getDefaultStatusText(status: StatusType): string {
  const texts: Record<StatusType, string> = {
    success: m['ide.deployment.status.success'](),
    warning: m['ide.deployment.status.warning'](),
    error: m['ide.deployment.status.error'](),
    info: m['ide.deployment.status.info'](),
    loading: m['ide.deployment.status.loading'](),
  }
  return texts[status]
}

const sizeConfig = {
  sm: {
    iconSize: 'w-3 h-3',
    containerSize: 'w-6 h-6',
    textSize: 'text-xs',
    padding: 'px-2 py-1',
  },
  md: {
    iconSize: 'w-4 h-4',
    containerSize: 'w-8 h-8',
    textSize: 'text-sm',
    padding: 'px-3 py-1.5',
  },
  lg: {
    iconSize: 'w-5 h-5',
    containerSize: 'w-10 h-10',
    textSize: 'text-base',
    padding: 'px-4 py-2',
  },
} as const

export function StatusIndicator({
  status,
  size = 'md',
  showText = false,
  text,
  className,
}: StatusIndicatorProps) {
  const config = statusConfig[status]
  const sizeStyles = sizeConfig[size]
  const Icon = config.icon
  const displayText = text || getDefaultStatusText(status)

  if (showText) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-full font-medium',
          config.colorClass,
          sizeStyles.padding,
          sizeStyles.textSize,
          className
        )}
      >
        <Icon
          className={cn(sizeStyles.iconSize, status === 'loading' && 'animate-spin')}
          aria-hidden='true'
        />
        <span>{displayText}</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        config.colorClass,
        sizeStyles.containerSize,
        className
      )}
      title={displayText}
      aria-label={displayText}
    >
      <Icon
        className={cn(sizeStyles.iconSize, status === 'loading' && 'animate-spin')}
        aria-hidden='true'
      />
    </div>
  )
}
