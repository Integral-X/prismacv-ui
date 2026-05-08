import { expect, test } from '@playwright/test';
import {
  hasLoginCredentials,
  loginAsTestUser,
  runA11yAudit,
} from './helpers/e2e-test-utils';

const cvId = process.env.E2E_TEST_CV_ID?.trim() ?? '';

test.describe('CV editor save and PDF export', () => {
  test.skip(
    !hasLoginCredentials || !cvId,
    'Set E2E_TEST_USER_EMAIL, E2E_TEST_USER_PASSWORD, and E2E_TEST_CV_ID to run CV editor flow.'
  );

  test('saves personal info and exports a PDF', async ({ page }) => {
    await loginAsTestUser(page, `/cv/${cvId}/edit`);
    await expect(page.getByText('Personal Info')).toBeVisible();
    await runA11yAudit(page);

    await page
      .getByPlaceholder('John Doe')
      .fill(`E2E Candidate ${new Date().getTime()}`);
    await page.getByRole('button', { name: /^save$/i }).click();
    await expect(page.getByText(/personal info saved/i)).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /export pdf/i }).click(),
    ]);

    expect(download.suggestedFilename().toLowerCase()).toContain('.pdf');
  });
});
