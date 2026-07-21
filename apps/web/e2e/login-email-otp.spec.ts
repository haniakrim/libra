/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * login-email-otp.spec.ts
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

import { test, expect } from '@playwright/test'

/**
 * E2E coverage for the email-OTP login flow.
 *
 * This spec walks the full UI journey from the login page through requesting
 * a one-time password. The actual email delivery and final sign-in verification
 * are intentionally left for a follow-up test once a Resend account and
 * RESEND_API_KEY are configured, because better-auth's emailOtp plugin requires
 * a working email provider to send real OTPs.
 *
 * Cloudflare Turnstile test keys are used locally so the CAPTCHA auto-passes.
 */
test.describe('Email OTP login flow', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept the OTP send endpoint and return a mock success so the UI
    // can transition to the OTP form without a real email provider.
    await page.route('**/api/auth/email-otp/send-verification-otp', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })
  })

  test('requests an OTP and shows the verification form', async ({ page }) => {
    await page.goto('/login')

    // 1. Email step is visible.
    const emailInput = page.getByRole('textbox', { name: /email/i })
    await expect(emailInput).toBeVisible()

    // 2. Fill a valid email and wait for Turnstile to auto-verify with the local test key.
    await emailInput.fill('local-test@example.com')
    const continueButton = page.getByRole('button', { name: /continue/i })
    await expect(continueButton).toBeEnabled({ timeout: 15000 })

    // 3. Submit the email form.
    await continueButton.click()

    // 4. OTP step appears.
    await expect(page.getByText(/verification code/i)).toBeVisible()
    await expect(page.getByText('local-test@example.com')).toBeVisible()

    // 5. Fill a 6-digit OTP and ensure verify is enabled.
    // The input-otp component exposes a single hidden input that accepts the code.
    const otpInput = page.locator('input[inputmode="numeric"][maxlength="6"]')
    await expect(otpInput).toBeVisible()
    await otpInput.fill('123456')

    const verifyButton = page.getByRole('button', { name: /verify/i })
    await expect(verifyButton).toBeEnabled()

    // NOTE: We stop short of clicking "Verify" because that calls the real
    // better-auth sign-in endpoint, which needs a valid OTP sent by email.
    // Once RESEND_API_KEY is configured, extend this test to submit the real
    // OTP and assert the user is redirected to the dashboard.
  })
})
