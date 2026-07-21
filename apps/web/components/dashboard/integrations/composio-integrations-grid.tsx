/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * composio-integrations-grid.tsx
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

import { Badge } from '@libra/ui/components/badge'
import { Button } from '@libra/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@libra/ui/components/card'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AlertCircle, CheckCircle, Loader2, Plug, Unplug } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useTRPC } from '@/trpc/client'

function createCenteredPopup(url: string, name: string, width: number, height: number) {
  const left = window.screen.width / 2 - width / 2
  const top = window.screen.height / 2 - height / 2
  return window.open(
    url,
    name,
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  )
}

function ToolkitCard({
  toolkit,
  onChanged,
}: {
  toolkit: { slug: string; name: string; description: string; status: string }
  onChanged: () => void
}) {
  const trpc = useTRPC()
  const [isConnecting, setIsConnecting] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isConnected = toolkit.status === 'ACTIVE'
  const isPending = toolkit.status === 'INITIATED' || toolkit.status === 'INITIALIZING'

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  const checkStatusMutation = useMutation(
    trpc.integrations.checkStatus.mutationOptions({
      onSuccess: (data) => {
        if (data.status === 'ACTIVE' || data.status === 'FAILED' || data.status === 'EXPIRED') {
          stopPolling()
          setIsConnecting(false)
          if (data.status === 'ACTIVE') {
            toast.success(`${toolkit.name} connected`)
          } else {
            toast.error(`${toolkit.name} connection failed`)
          }
          onChanged()
        }
      },
    })
  )

  const connectMutation = useMutation(
    trpc.integrations.connect.mutationOptions({
      onSuccess: (data) => {
        const popup = createCenteredPopup(data.redirectUrl, `composio-${toolkit.slug}`, 600, 700)
        if (!popup) {
          setIsConnecting(false)
          toast.error('Popup blocked — allow popups to connect this integration')
          return
        }
        popup.focus()

        pollRef.current = setInterval(() => {
          checkStatusMutation.mutate({ toolkitSlug: toolkit.slug })
          if (popup.closed) {
            stopPolling()
            setIsConnecting(false)
            onChanged()
          }
        }, 2000)

        setTimeout(
          () => {
            stopPolling()
            setIsConnecting(false)
          },
          5 * 60 * 1000
        )
      },
      onError: (error) => {
        toast.error(error.message || `Failed to start ${toolkit.name} connection`)
        setIsConnecting(false)
      },
    })
  )

  const disconnectMutation = useMutation(
    trpc.integrations.disconnect.mutationOptions({
      onSuccess: () => {
        toast.success(`${toolkit.name} disconnected`)
        onChanged()
      },
      onError: (error) => {
        toast.error(error.message || `Failed to disconnect ${toolkit.name}`)
      },
    })
  )

  const handleConnect = () => {
    setIsConnecting(true)
    connectMutation.mutate({ toolkitSlug: toolkit.slug })
  }

  const handleDisconnect = () => {
    disconnectMutation.mutate({ toolkitSlug: toolkit.slug })
  }

  const busy = isConnecting || connectMutation.isPending || disconnectMutation.isPending

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex-1'>
            <CardTitle className='flex items-center gap-2 text-base'>
              {toolkit.name}
              {isConnected && (
                <Badge
                  variant='secondary'
                  className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                >
                  <CheckCircle className='mr-1 h-3 w-3' />
                  Connected
                </Badge>
              )}
              {isPending && (
                <Badge variant='outline'>
                  <Loader2 className='mr-1 h-3 w-3 animate-spin' />
                  Pending
                </Badge>
              )}
              {!isConnected && !isPending && (
                <Badge variant='outline'>
                  <AlertCircle className='mr-1 h-3 w-3' />
                  Not connected
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{toolkit.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <Button variant='outline' size='sm' onClick={handleDisconnect} disabled={busy}>
            {busy ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Unplug className='mr-2 h-4 w-4' />
            )}
            Disconnect
          </Button>
        ) : (
          <Button size='sm' onClick={handleConnect} disabled={busy}>
            {busy ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Plug className='mr-2 h-4 w-4' />
            )}
            Connect
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function ComposioIntegrationsGrid() {
  const trpc = useTRPC()
  const { data: toolkits, isLoading, refetch } = useQuery(trpc.integrations.list.queryOptions({}))

  if (isLoading) {
    return (
      <div className='flex items-center gap-3 rounded-lg bg-muted/50 p-4'>
        <Loader2 className='h-4 w-4 animate-spin' />
        <span className='text-sm'>Loading integrations...</span>
      </div>
    )
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      {toolkits?.map((toolkit) => (
        <ToolkitCard key={toolkit.slug} toolkit={toolkit} onChanged={() => refetch()} />
      ))}
    </div>
  )
}
