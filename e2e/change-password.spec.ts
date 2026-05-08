import { expect, test } from '@playwright/test';
import {
  expectRedirectToLogin,
  hasLoginCredentials,
  loginAsTestUser,
  loginCredentials,
  runA11yAudit,
} from './helpers/e2e-test-utils';

test.describe('Change password', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await expectRedirectToLogin(page, '/settings/change-password');
  });

  test.describe('Authenticated change password page', () => {
    test.skip(
      !hasLoginCredentials,
      'Set E2E_TEST_USER_EMAIL and E2E_TEST_USER_PASSWORD to run authenticated password checks.'
    );

    test('shows validation error for mismatched passwords', async ({
      page,
    }) => {
      await loginAsTestUser(page, '/settings/change-password');
      await expect(
        page.getByRole('heading', { name: /change password/i })
      ).toBeVisible();
      await runA11yAudit(page);

      await page
        .getByPlaceholder('Enter current password')
        .fill(loginCredentials.password);
      await page.getByPlaceholder('Enter new password').fill('ValidPass123!');
      await page
        .getByPlaceholder('Confirm new password')
        .fill('DifferentPass123!');
      await page.getByRole('button', { name: /change password/i }).click();

      await expect(page.getByText(/passwords do not match/i)).toBeVisible();
    });
  });
});
