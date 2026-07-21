/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * actions.ts
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

'use server'

import { sendContactFormNotification } from '@libra/email'
import { env } from '@libra/email/env.mjs'
import { z } from 'zod/v4'

const supportFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Enter a valid email address').max(320),
  message: z.string().trim().min(10, 'Message is too short').max(5000),
})

export type SupportFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function submitSupportRequest(
  _prevState: SupportFormState,
  formData: FormData
): Promise<SupportFormState> {
  const parsed = supportFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  })

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    return { status: 'error', message: firstIssue?.message ?? 'Invalid submission' }
  }

  try {
    await sendContactFormNotification({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
      recipientEmail: env.RESEND_FROM,
    })
    return { status: 'success' }
  } catch (error) {
    console.error('[Support] Failed to send support request notification:', error)
    return {
      status: 'error',
      message: 'Something went wrong sending your message. Please try again shortly.',
    }
  }
}
