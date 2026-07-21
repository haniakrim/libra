/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * page.tsx
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
import { ComposioIntegrationsGrid } from '@/components/dashboard/integrations/composio-integrations-grid'
import { GitHubIntegrationCard } from '@/components/dashboard/integrations/github-integration-card'
import * as m from '@/paraglide/messages'

export default function IntegrationsPage() {
  return (
    <div className='container mx-auto py-8 px-4 max-w-4xl'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>{m['dashboard.integrations.title']()}</h1>
        <p className='text-muted-foreground mt-2'>{m['dashboard.integrations.subtitle']()}</p>
      </div>

      <div className='grid gap-6'>
        <GitHubIntegrationCard />

        <div>
          <h2 className='text-xl font-semibold tracking-tight mb-4'>More Integrations</h2>
          <ComposioIntegrationsGrid />
        </div>
      </div>
    </div>
  )
}
