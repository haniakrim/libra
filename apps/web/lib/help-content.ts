/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * help-content.ts
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

export interface HelpArticle {
  id: string
  category: 'Getting started' | 'Troubleshooting' | 'Billing' | 'Integrations'
  question: string
  answer: string
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: 'first-project',
    category: 'Getting started',
    question: 'How do I create my first project?',
    answer:
      'From your dashboard, click "Create Project" and describe the app you want in plain language. The agent plans the structure and gives you a live preview as it builds — no setup required.',
  },
  {
    id: 'iterate-chat',
    category: 'Getting started',
    question: 'How do I make changes after the first generation?',
    answer:
      'Keep chatting in the project editor: describe the change you want ("add a settings page", "change the primary color to green") and it applies to the live preview immediately.',
  },
  {
    id: 'ai-stuck-thinking',
    category: 'Troubleshooting',
    question: 'The AI chat is stuck on "Thinking" and never responds',
    answer:
      "This usually means the selected model's provider is temporarily unreachable or misconfigured on the backend. Try switching to a different model in the chat panel's model selector and resending your message. If every model fails, check the status of your organization's AI quota on the Billing page, and if it still fails, contact Support with the project URL and the message you sent.",
  },
  {
    id: 'quota-exhausted',
    category: 'Troubleshooting',
    question: '"Project quota exhausted" when creating a new project',
    answer:
      'Your plan has a limit on the number of active projects. Free plans include 3 projects. Delete an unused project, or upgrade your plan from the Billing page to raise the limit.',
  },
  {
    id: 'github-sync-not-working',
    category: 'Troubleshooting',
    question: "GitHub sync isn't picking up my changes",
    answer:
      "Confirm the repository is still connected from Dashboard → Integrations — GitHub tokens can expire and need re-authorizing. If it's connected but a specific push isn't syncing, check that you pushed to the branch the project is tracking (shown in project settings).",
  },
  {
    id: 'custom-domain-not-verifying',
    category: 'Troubleshooting',
    question: 'My custom domain shows "not verified"',
    answer:
      'DNS changes can take up to a few hours to propagate. Double-check the CNAME record matches exactly what was shown in Project → Settings → Domains, with no extra trailing dot or typo, then wait and refresh — SSL provisions automatically once DNS resolves correctly.',
  },
  {
    id: 'integration-connect-fails',
    category: 'Integrations',
    question:
      'Connecting an integration (Slack, Notion, etc.) fails or the popup closes with no result',
    answer:
      "Make sure your browser isn't blocking popups for this site, then try again from Dashboard → Integrations. If the popup opens but the authorization page errors, the third-party service may be temporarily down — try again in a few minutes.",
  },
  {
    id: 'disconnect-integration',
    category: 'Integrations',
    question: 'How do I disconnect an integration?',
    answer:
      'Go to Dashboard → Integrations and click "Disconnect" on the connected tool. This revokes access immediately; you can reconnect at any time.',
  },
  {
    id: 'upgrade-plan',
    category: 'Billing',
    question: 'How do I upgrade my plan?',
    answer:
      'Open Billing from your dashboard sidebar and choose a plan. Upgrades apply immediately and raise your AI generation quota, seats, and project limit right away.',
  },
  {
    id: 'cancel-subscription',
    category: 'Billing',
    question: 'How do I cancel or downgrade?',
    answer:
      'From Billing, choose "Manage subscription" to cancel or switch plans. You keep access to your current plan\'s features until the end of the billing period.',
  },
  {
    id: 'invite-teammate',
    category: 'Getting started',
    question: 'How do I invite a teammate?',
    answer:
      'Go to Teams from your dashboard sidebar, invite by email, and assign a role. Seat limits depend on your plan — check Billing if an invite is blocked.',
  },
]

export const HELP_CATEGORIES: HelpArticle['category'][] = [
  'Getting started',
  'Troubleshooting',
  'Integrations',
  'Billing',
]
