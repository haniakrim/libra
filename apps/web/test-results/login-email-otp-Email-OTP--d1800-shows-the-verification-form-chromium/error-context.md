# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login-email-otp.spec.ts >> Email OTP login flow >> requests an OTP and shows the verification form
- Location: e2e/login-email-otp.spec.ts:47:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeEnabled() failed

Locator: getByRole('button', { name: /continue/i })
Expected: enabled
Error: element(s) not found

Call log:
  - Expect "toBeEnabled" with timeout 15000ms
  - waiting for getByRole('button', { name: /continue/i })

```

```yaml
- complementary "Tanstack query devtools":
  - separator "Resize devtools panel"
  - button "Close tanstack query devtools":
    - img
  - button "Close Tanstack query devtools": TANSTACK React Query v5
  - radiogroup "Toggle between queries and mutations view":
    - group:
      - radio "Queries" [checked]
      - text: Queries
    - group:
      - radio "Mutations"
      - text: Mutations
  - 'button "Fresh: 0" [disabled]': Fresh 0
  - 'button "Fetching: 0" [disabled]': Fetching 0
  - 'button "Paused: 0" [disabled]': Paused 0
  - 'button "Stale: 0" [disabled]': Stale 0
  - 'button "Inactive: 0" [disabled]': Inactive 0
  - img
  - textbox "Filter queries by query key":
    - /placeholder: Filter
  - combobox "Sort queries by":
    - option "Sort by status" [selected]
    - option "Sort by query hash"
    - option "Sort by last updated"
  - img
  - button "Sort order ascending":
    - text: Asc
    - img
  - button "Clear query cache":
    - img
  - button "Mock offline behavior":
    - img
  - button "Open in picture-in-picture mode":
    - img
  - button "Open settings menu":
    - img
- button:
  - img
- main "Create an account or sign-In":
  - heading "Create an account or sign-In" [level=3]
  - paragraph: You will receive a magic link in your email
  - form "Create an account or sign-In":
    - group "Social authentication options":
      - button "GitHub - You will receive a magic link in your email": GitHub
    - group "Email authentication":
      - text: Email
      - textbox "Email":
        - /placeholder: nextify@libra.agentic-lab.io
        - text: local-test@example.com
    - text: Loading CAPTCHA verification...
  - button "Send me my link" [disabled]
  - text: Please complete the security verification above
- img "Logo"
- img "Check filled icon"
- text: AI-Powered Development
- img "Check filled icon"
- text: Cloud IDE Environment
- img "Check icon"
- text: Open Source Core
- img "Check icon"
- text: GitHub Integration
- img "Check icon"
- text: Custom Domain Deployment
- img "Check icon"
- text: Multi-Model AI Support
- img "Check icon"
- text: Real-Time Preview
- img "Check icon"
- text: Welcome to Libra
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | /*
  2  |  * SPDX-License-Identifier: AGPL-3.0-only
  3  |  * login-email-otp.spec.ts
  4  |  * Copyright (C) 2025 Nextify Limited
  5  |  *
  6  |  * This program is free software: you can redistribute it and/or modify
  7  |  * it under the terms of the GNU Affero General Public License as
  8  |  * published by the Free Software Foundation, either version 3 of the
  9  |  * License, or (at your option) any later version.
  10 |  *
  11 |  * This program is distributed in the hope that it will be useful,
  12 |  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  13 |  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  14 |  * GNU Affero General Public License for more details.
  15 |  *
  16 |  * You should have received a copy of the GNU Affero General Public License
  17 |  * along with this program. If not, see <https://www.gnu.org/licenses/>.
  18 |  *
  19 |  */
  20 | 
  21 | import { test, expect } from '@playwright/test'
  22 | 
  23 | /**
  24 |  * E2E coverage for the email-OTP login flow.
  25 |  *
  26 |  * This spec walks the full UI journey from the login page through requesting
  27 |  * a one-time password. The actual email delivery and final sign-in verification
  28 |  * are intentionally left for a follow-up test once a Resend account and
  29 |  * RESEND_API_KEY are configured, because better-auth's emailOtp plugin requires
  30 |  * a working email provider to send real OTPs.
  31 |  *
  32 |  * Cloudflare Turnstile test keys are used locally so the CAPTCHA auto-passes.
  33 |  */
  34 | test.describe('Email OTP login flow', () => {
  35 |   test.beforeEach(async ({ page }) => {
  36 |     // Intercept the OTP send endpoint and return a mock success so the UI
  37 |     // can transition to the OTP form without a real email provider.
  38 |     await page.route('**/api/auth/email-otp/send-verification-otp', async (route) => {
  39 |       await route.fulfill({
  40 |         status: 200,
  41 |         contentType: 'application/json',
  42 |         body: JSON.stringify({ success: true }),
  43 |       })
  44 |     })
  45 |   })
  46 | 
  47 |   test('requests an OTP and shows the verification form', async ({ page }) => {
  48 |     await page.goto('/login')
  49 | 
  50 |     // 1. Email step is visible.
  51 |     const emailInput = page.getByRole('textbox', { name: /email/i })
  52 |     await expect(emailInput).toBeVisible()
  53 | 
  54 |     // 2. Fill a valid email and wait for Turnstile to auto-verify with the local test key.
  55 |     await emailInput.fill('local-test@example.com')
  56 |     const continueButton = page.getByRole('button', { name: /continue/i })
> 57 |     await expect(continueButton).toBeEnabled({ timeout: 15000 })
     |                                  ^ Error: expect(locator).toBeEnabled() failed
  58 | 
  59 |     // 3. Submit the email form.
  60 |     await continueButton.click()
  61 | 
  62 |     // 4. OTP step appears.
  63 |     await expect(page.getByText(/verification code/i)).toBeVisible()
  64 |     await expect(page.getByText('local-test@example.com')).toBeVisible()
  65 | 
  66 |     // 5. Fill a 6-digit OTP and ensure verify is enabled.
  67 |     // The input-otp component exposes a single hidden input that accepts the code.
  68 |     const otpInput = page.locator('input[inputmode="numeric"][maxlength="6"]')
  69 |     await expect(otpInput).toBeVisible()
  70 |     await otpInput.fill('123456')
  71 | 
  72 |     const verifyButton = page.getByRole('button', { name: /verify/i })
  73 |     await expect(verifyButton).toBeEnabled()
  74 | 
  75 |     // NOTE: We stop short of clicking "Verify" because that calls the real
  76 |     // better-auth sign-in endpoint, which needs a valid OTP sent by email.
  77 |     // Once RESEND_API_KEY is configured, extend this test to submit the real
  78 |     // OTP and assert the user is redirected to the dashboard.
  79 |   })
  80 | })
  81 | 
```