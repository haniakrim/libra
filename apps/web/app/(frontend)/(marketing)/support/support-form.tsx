/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * support-form.tsx
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
import { Label } from '@libra/ui/components/label'
import { Textarea } from '@libra/ui/components/textarea'
import { CheckCircle2, Loader2, TriangleAlert } from 'lucide-react'
import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { type SupportFormState, submitSupportRequest } from './actions'

const initialState: SupportFormState = { status: 'idle' }

export function SupportForm() {
  const [state, formAction, isPending] = useActionState(submitSupportRequest, initialState)

  if (state.status === 'success') {
    return (
      <div className='glass-1 flex flex-col items-center gap-3 rounded-2xl p-8 text-center shadow-lg'>
        <CheckCircle2 className='h-10 w-10 text-brand' />
        <h3 className='text-xl font-semibold'>Message sent</h3>
        <p className='text-muted-foreground'>
          Thanks for reaching out — we typically respond within one business day.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className='glass-1 grid gap-6 rounded-2xl p-8 shadow-lg'>
      <div className='grid gap-2'>
        <Label htmlFor='name'>Name</Label>
        <Input id='name' name='name' placeholder='Your name' required disabled={isPending} />
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          name='email'
          type='email'
          placeholder='you@example.com'
          required
          disabled={isPending}
        />
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='message'>How can we help?</Label>
        <Textarea
          id='message'
          name='message'
          placeholder='Describe the issue or question in detail — the more context, the faster we can help.'
          className='min-h-[140px]'
          required
          disabled={isPending}
        />
      </div>

      {state.status === 'error' && (
        <div className='flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
          <TriangleAlert className='h-4 w-4 shrink-0' />
          {state.message}
        </div>
      )}

      <Button type='submit' variant='glow' className='w-full' disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Sending...
          </>
        ) : (
          'Send message'
        )}
      </Button>
    </form>
  )
}
