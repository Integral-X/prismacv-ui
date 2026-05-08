import { expect, test } from '@playwright/test';
import {
  expectRedirectToLogin,
  hasLoginCredentials,
  loginAsTestUser,
  runA11yAudit,
} from './helpers/e2e-test-utils';

test.describe('ATS scorer', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await expectRedirectToLogin(page, '/ats-scorer');
  });

  test.describe('Authenticated ATS page', () => {
    test.skip(
      !hasLoginCredentials,
      'Set E2E_TEST_USER_EMAIL and E2E_TEST_USER_PASSWORD to run authenticated ATS checks.'
    );

    test('renders ATS scorer form and passes critical a11y checks', async ({
      page,
    }) => {
      await loginAsTestUser(page, '/ats-scorer');
      await expect(
        page.getByRole('heading', { level: 1, name: /ats match scorer/i })
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: /score match/i })
      ).toBeVisible();
      await runA11yAudit(page);
    });
  });
});
