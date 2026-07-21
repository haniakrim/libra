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

import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

const OTP_CAPTURE_PATH = '/tmp/libra-e2e-otp.json'

/**
 * Detect whether the test should exercise the real email-OTP backend path.
 * A real run requires a valid Resend key and the E2E_CAPTURE_OTP helper so the
 * generated OTP can be read back from the server filesystem in CI.
 */
const isRealOtpRun = () =>
  Boolean(
    process.env.E2E_RESEND_API_KEY &&
      process.env.E2E_RESEND_API_KEY.length > 0 &&
      process.env.E2E_CAPTURE_OTP === 'true'
  )

/**
 * E2E coverage for the email-OTP login flow.
 *
 * This spec walks the full UI journey from the login page through requesting
 * a one-time password. The default mode stubs the send endpoint so the test
 * passes without a real email provider. When E2E_RESEND_API_KEY and
 * E2E_CAPTURE_OTP are configured, the spec completes the real sign-in and
 * asserts a redirect to /dashboard.
 *
 * Cloudflare Turnstile is stubbed in the browser so the CAPTCHA auto-passes
 * in local/headless environments without calling the real Cloudflare endpoint.
 */
test.describe('Email OTP login flow', () => {
  test.beforeEach(async ({ page }) => {
    // Stub the Cloudflare Turnstile API script so the widget immediately
    // reports success and enables the email submit button.
    await page.route('**/turnstile/v0/api.js*', async (route, request) => {
      const url = new URL(request.url())
      const onload = url.searchParams.get('onload') || 'onloadTurnstileCallback'
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript; charset=utf-8',
        body: `(function(){
          const widgets = new Map();
          window.turnstile = {
            render: (container, options) => {
              const id = 'test-turnstile-widget';
              widgets.set(id, options);
              Promise.resolve().then(() => {
                if (typeof options === 'object' && options.callback) options.callback('test-token');
              });
              return id;
            },
            reset: () => {},
            remove: (id) => widgets.delete(id),
            getResponse: () => 'test-token',
            isExpired: () => false,
            execute: () => {},
          };
          if (typeof window['${onload}'] === 'function') window['${onload}']();
        })();`,
      })
    })

    // In mock mode, intercept the OTP send endpoint so the UI transitions
    // without a real email provider.
    if (!isRealOtpRun()) {
      await page.route('**/api/auth/email-otp/send-verification-otp', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        })
      })
    }
  })

  test('requests an OTP and shows the verification form', async ({ page }) => {
    await page.goto('/login')

    // 1. Email step is visible.
    const emailInput = page.getByRole('textbox', { name: /email/i })
    await expect(emailInput).toBeVisible()

    // 2. Fill a valid email and wait for the stubbed Turnstile widget to verify.
    await emailInput.fill('local-test@example.com')

    const submitButton = page.getByRole('button', { name: /send me my link/i })
    await expect(submitButton).toBeEnabled({ timeout: 15000 })

    // 3. Submit the email form.
    await submitButton.click()

    // 4. OTP step appears.
    await expect(page.getByText(/verification code/i)).toBeVisible()
    await expect(page.getByText('local-test@example.com')).toBeVisible()

    // 5. Fill a 6-digit OTP and ensure verify is enabled.
    // input-otp exposes a single hidden input tagged with [data-input-otp].
    const otpInput = page.locator('input[data-input-otp]')
    await expect(otpInput).toBeAttached()
    await otpInput.fill('123456')

    const verifyButton = page.getByRole('button', { name: /verify and sign in/i })
    await expect(verifyButton).toBeEnabled()

    // NOTE: We stop short of clicking "Verify" in mock mode because that calls
    // the real better-auth sign-in endpoint, which needs a valid OTP stored by
    // the backend. Enable real-key mode (E2E_RESEND_API_KEY + E2E_CAPTURE_OTP)
    // to exercise the full sign-in redirect.
  })

  test('completes real email-OTP sign-in and redirects to dashboard', async ({ page }) => {
    test.skip(!isRealOtpRun(), 'skipped: E2E_RESEND_API_KEY and E2E_CAPTURE_OTP are not configured')

    const testEmail = process.env.E2E_TEST_EMAIL || 'e2e@example.com'
    await page.goto('/login')

    const emailInput = page.getByRole('textbox', { name: /email/i })
    await expect(emailInput).toBeVisible()
    await emailInput.fill(testEmail)

    const submitButton = page.getByRole('button', { name: /send me my link/i })
    await expect(submitButton).toBeEnabled({ timeout: 15000 })
    await submitButton.click()

    await expect(page.getByText(/verification code/i)).toBeVisible()

    // Read the OTP that the server wrote to the shared temp file. Retry briefly
    // because the file is written asynchronously by the email-otp plugin.
    let otpPayload: { otp: string } | null = null
    for (let attempt = 0; attempt < 20; attempt++) {
      try {
        const raw = await readFile(OTP_CAPTURE_PATH, 'utf8')
        otpPayload = JSON.parse(raw)
        if (otpPayload?.otp) break
      } catch {
        // File may not be written yet.
      }
      await new Promise((resolve) => setTimeout(resolve, 250))
    }

    expect(otpPayload).not.toBeNull()

    const otp = otpPayload?.otp
    if (otp?.length !== 6) {
      throw new Error('OTP was not captured from the server temp file')
    }

    const otpInput = page.locator('input[data-input-otp]')
    await otpInput.fill(otp)

    const verifyButton = page.getByRole('button', { name: /verify and sign in/i })
    await expect(verifyButton).toBeEnabled()
    await verifyButton.click()

    // Expect redirect to dashboard after successful sign-in.
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 })
  })
})
