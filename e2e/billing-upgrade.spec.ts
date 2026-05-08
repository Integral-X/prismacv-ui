import { expect, test } from '@playwright/test';
import {
  hasLoginCredentials,
  loginAsTestUser,
  runA11yAudit,
} from './helpers/e2e-test-utils';

const stripeUpgradeEnabled = process.env.E2E_STRIPE_UPGRADE === 'true';

test.describe('Billing upgrade flow', () => {
  test.skip(
    !stripeUpgradeEnabled || !hasLoginCredentials,
    'Set E2E_STRIPE_UPGRADE=true plus E2E_TEST_USER_EMAIL/E2E_TEST_USER_PASSWORD to run Stripe test-mode flow.'
  );

  test('starts Stripe checkout from billing page with mocked checkout host', async ({
    page,
  }) => {
    await page.route('https://checkout.stripe.com/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body><h1>Mock Stripe Checkout</h1></body></html>',
      })
    );

    await loginAsTestUser(page, '/settings/billing?plan=PRO&cycle=monthly');
    await page.waitForURL(/\/settings\/billing/);
    await expect(page.getByRole('heading', { name: /billing/i })).toBeVisible();
    await runA11yAudit(page);

    await page.getByRole('button', { name: /monthly/i }).click();
    await page.getByRole('button', { name: /upgrade to pro/i }).click();

    await page.waitForURL(/checkout\.stripe\.com/);
    await expect(
      page.getByRole('heading', { name: /mock stripe checkout/i })
    ).toBeVisible();
  });
});
