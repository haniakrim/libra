/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * models.ts
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

import { canAccessModel, getDefaultModelForPlan, findModelById } from '@/configs/ai-models'
import { env } from '@/env.mjs'
import type { AnthropicProviderOptions } from '@ai-sdk/anthropic'

// ============================================================================
// Model Configuration and Selection
// ============================================================================

// Azure OpenAI (AZURE_API_KEY / AZURE_RESOURCE_NAME / AZURE_BASE_URL) is not
// configured on this deployment, so 'gpt-4-1' and 'gpt-4-1-mini' are routed
// to the OpenRouter-backed Claude model (verified working) instead of the
// unreachable Azure endpoint. Revert to 'chat-model-reasoning-azure' /
// 'chat-model-reasoning-azure-mini' once real Azure credentials are set.
const MODEL_MAPPING: Record<string, string> = {
  'gpt-4-1': 'chat-model-reasoning-anthropic',
  'gpt-4-1-mini': 'chat-model-reasoning-anthropic',
  'claude-4-0-sonnet': 'chat-model-reasoning-anthropic',
  // 'databricks-claude-3-7-sonnet': 'chat-model-databricks-claude',
  'gemini-2-5-pro': 'chat-model-reasoning-google',
} as const

const DEFAULT_MODELS = {
  FILE_EDIT: 'gpt-4-1-mini',
  FALLBACK: 'chat-model-reasoning-anthropic',
  FILE_EDIT_FALLBACK: 'chat-model-reasoning-anthropic',
} as const

/**
 * Select and validate AI model
 */
export const selectModel = (
  userPlan: string,
  selectedModelId?: string,
  isFileEdit = false
): string => {
  let modelToUse = selectedModelId

  if (isFileEdit) {
    modelToUse = DEFAULT_MODELS.FILE_EDIT
  } else if (!modelToUse) {
    const defaultModel = getDefaultModelForPlan(userPlan)
    modelToUse = defaultModel.id
  } else {
    // Strict access control for non-file-edit operations
    if (!canAccessModel(userPlan, modelToUse)) {
      const requestedModel = findModelById(modelToUse)
      throw new Error(`Access denied: ${requestedModel.name} requires ${requestedModel.requiredPlan} subscription. Current plan: ${userPlan}`)
    }
  }

  return MODEL_MAPPING[modelToUse] || (isFileEdit ? DEFAULT_MODELS.FILE_EDIT_FALLBACK : DEFAULT_MODELS.FALLBACK)
}

/**
 * Build provider options for AI model
 */
export const buildProviderOptions = () => ({
  anthropic: {
    thinking: { type: 'enabled', budgetTokens: 4096 },
  } satisfies AnthropicProviderOptions,
  openai: {
    ...(env.REASONING_ENABLED ? { reasoningEffort: 'medium' } : {}),
  },
})
