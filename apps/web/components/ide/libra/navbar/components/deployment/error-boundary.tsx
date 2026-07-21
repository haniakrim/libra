/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * error-boundary.tsx
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
import { AlertTriangle, Bug, HelpCircle, RefreshCw } from 'lucide-react'
import { Component, type ErrorInfo, memo, type ReactNode } from 'react'
import * as m from '@/paraglide/messages'
import { ActionButton } from './atoms'
import { DeploymentStatusIndicator } from './atoms/deployment-status-indicator'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  className?: string
}

/**
 * Error boundary component for deployment dialog
 * Provides graceful error handling and recovery options
 */
export class DeploymentErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Call optional error handler
    this.props.onError?.(error, errorInfo)

    // Log error for debugging
    console.error('Deployment Error Boundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Enhanced default error UI with new design system
      return (
        <main
          className={cn('deployment-section flex flex-col text-center', this.props.className)}
          style={{ gap: 'var(--deployment-section-gap)' }}
          role='alert'
          aria-labelledby='error-title'
        >
          {/* Error Icon with enhanced design */}
          <div className='flex flex-col items-center space-y-4'>
            <div
              className='relative w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-lg'
              style={{
                background: 'linear-gradient(135deg, var(--deployment-color-error), #dc2626)',
                borderRadius: 'var(--deployment-radius-xl)',
              }}
            >
              <AlertTriangle className='w-8 h-8 text-white' aria-hidden='true' />
            </div>

            {/* Error Status Indicator */}
            <DeploymentStatusIndicator
              status='error'
              message={m['ide.deployment.errorBoundary.deploymentError']()}
              size='sm'
              showAnimation={false}
            />
          </div>

          {/* Error Message */}
          <div className='deployment-card-enhanced deployment-status-error'>
            <div className='space-y-3'>
              <h2 id='error-title' className='deployment-text-title text-foreground'>
                {m['ide.deployment.errorBoundary.errorOccurred']()}
              </h2>
              <p className='deployment-text-body text-muted-foreground max-w-md mx-auto'>
                {this.state.error?.message || m['ide.deployment.errorBoundary.unexpectedError']()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='deployment-action-bar'>
            <ActionButton
              intent='secondary'
              onClick={this.handleRetry}
              icon={RefreshCw}
              className='flex-1'
              aria-label={m['ide.deployment.errorBoundary.retryDeployment']()}
            >
              {m['ide.deployment.errorBoundary.retry']()}
            </ActionButton>
            <ActionButton
              intent='secondary'
              onClick={() => window.location.reload()}
              icon={HelpCircle}
              className='flex-1'
              aria-label={m['ide.deployment.errorBoundary.getHelp']()}
            >
              {m['ide.deployment.errorBoundary.getHelp']()}
            </ActionButton>
          </div>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <div className='deployment-card-enhanced'>
              <details className='text-left'>
                <summary className='cursor-pointer deployment-text-subtitle font-semibold mb-3 text-muted-foreground hover:text-foreground transition-colors'>
                  <Bug className='w-4 h-4 inline mr-2' />
                  {m['ide.deployment.errorBoundary.errorDetailsDevMode']()}
                </summary>
                <div className='deployment-text-caption font-mono bg-muted/50 p-3 rounded-lg overflow-auto max-h-40'>
                  <pre className='whitespace-pre-wrap text-xs'>
                    {this.state.error?.stack}
                    {'\n\nComponent Stack:'}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            </div>
          )}
        </main>
      )
    }

    return this.props.children
  }
}

/**
 * Hook-based error handler for functional components
 */
export function useErrorHandler() {
  const handleError = (error: Error, context?: string) => {
    console.error(`Deployment Error${context ? ` (${context})` : ''}:`, error)

    // You can integrate with error reporting services here
    // Example: Sentry.captureException(error, { tags: { context } })
  }

  return { handleError }
}

/**
 * Error display component for inline errors
 */
interface ErrorDisplayProps {
  error?: Error | string | null
  onRetry?: () => void
  className?: string
  variant?: 'inline' | 'card'
}

export const ErrorDisplay = memo<ErrorDisplayProps>(
  ({ error, onRetry, className, variant = 'inline' }) => {
    if (!error) return null

    const errorMessage = typeof error === 'string' ? error : error.message

    if (variant === 'card') {
      return (
        <div className={cn('deployment-card-enhanced deployment-status-error', className)}>
          <div className='flex items-start deployment-element-spacing'>
            <div className='deployment-icon-container-enhanced bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'>
              <AlertTriangle
                className='w-5 h-5 text-red-600 dark:text-red-400'
                aria-hidden='true'
              />
            </div>
            <div className='flex-1 space-y-3'>
              <div>
                <h4 className='deployment-text-subtitle font-semibold text-red-700 dark:text-red-300'>
                  {m['ide.deployment.errorBoundary.error']()}
                </h4>
                <p className='deployment-text-body text-muted-foreground mt-1'>{errorMessage}</p>
              </div>
              {onRetry && (
                <ActionButton
                  intent='secondary'
                  onClick={onRetry}
                  icon={RefreshCw}
                  className='w-auto'
                  aria-label={m['ide.deployment.errorBoundary.retryOperation']()}
                >
                  {m['ide.deployment.errorBoundary.retry']()}
                </ActionButton>
              )}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        className={cn(
          'flex items-center deployment-button-spacing p-3 rounded-lg',
          'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800',
          className
        )}
      >
        <AlertTriangle
          className='w-4 h-4 flex-shrink-0 text-red-600 dark:text-red-400'
          aria-hidden='true'
        />
        <span className='deployment-text-body text-red-700 dark:text-red-300 flex-1'>
          {errorMessage}
        </span>
        {onRetry && (
          <ActionButton
            intent='secondary'
            onClick={onRetry}
            icon={RefreshCw}
            className='h-8 px-2 text-xs'
            aria-label={m['ide.deployment.errorBoundary.retryOperation']()}
          >
            {m['ide.deployment.errorBoundary.retry']()}
          </ActionButton>
        )}
      </div>
    )
  }
)

ErrorDisplay.displayName = 'ErrorDisplay'
