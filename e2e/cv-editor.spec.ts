import { expect, test } from '@playwright/test';
import {
  expectRedirectToLogin,
  hasLoginCredentials,
  loginAsTestUser,
  runA11yAudit,
} from './helpers/e2e-test-utils';

const cvId = process.env.E2E_TEST_CV_ID?.trim() ?? '';
const hasEditorEnv = hasLoginCredentials && Boolean(cvId);

const SKIP_MSG =
  'Set E2E_TEST_USER_EMAIL, E2E_TEST_USER_PASSWORD, and E2E_TEST_CV_ID to run CV editor tests.';

// ---------------------------------------------------------------------------
// Unauthenticated — no credentials required
// ---------------------------------------------------------------------------

test.describe('CV editor — unauthenticated redirect', () => {
  test('redirects to login page and preserves the return path', async ({
    page,
  }) => {
    await expectRedirectToLogin(page, '/cv/some-id/edit');
  });
});

// ---------------------------------------------------------------------------
// Authenticated — shared login before each test
// ---------------------------------------------------------------------------

test.describe('CV editor — page structure', () => {
  test.skip(!hasEditorEnv, SKIP_MSG);

  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, `/cv/${cvId}/edit`);
  });

  test('renders header navigation, micro-rail, and document canvas', async ({
    page,
  }) => {
    // Back link
    await expect(
      page.getByRole('link', { name: 'Back to dashboard' })
    ).toBeVisible();

    // Toolbar panel buttons
    await expect(page.getByRole('button', { name: 'Content' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Analyze' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Optimize' })).toBeVisible();

    // Micro-rail action buttons
    await expect(page.getByRole('button', { name: 'Preview' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Download PDF' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Share' }).first()
    ).toBeVisible();
  });

  test('save indicator shows "All changes saved" on initial load', async ({
    page,
  }) => {
    await expect(page.getByText('All changes saved')).toBeVisible();
  });

  test('passes critical accessibility checks on load', async ({ page }) => {
    await runA11yAudit(page);
  });
});

// ---------------------------------------------------------------------------
// Panel switching
// ---------------------------------------------------------------------------

test.describe('CV editor — panel switching', () => {
  test.skip(!hasEditorEnv, SKIP_MSG);

  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, `/cv/${cvId}/edit`);
  });

  test('Content panel is open and active by default', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Content' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(
      page.getByRole('heading', { level: 2, name: 'Content' })
    ).toBeVisible();
  });

  test('clicking Analyze switches to the analysis panel', async ({ page }) => {
    await page.getByRole('button', { name: 'Analyze' }).click();

    await expect(page.getByRole('button', { name: 'Analyze' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(
      page.getByRole('heading', { level: 2, name: 'Analyze' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Content' })
    ).not.toBeVisible();
  });

  test('clicking Optimize switches to the optimization panel', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Optimize' }).click();

    await expect(
      page.getByRole('heading', { level: 2, name: 'Optimize' })
    ).toBeVisible();
  });

  test('Close panel button collapses the aside', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 2, name: 'Content' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Close panel' }).click();

    await expect(
      page.getByRole('heading', { level: 2, name: 'Content' })
    ).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Content' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  test('clicking the active panel button collapses it (toggle off)', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { level: 2, name: 'Content' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Content' }).click();

    await expect(
      page.getByRole('heading', { level: 2, name: 'Content' })
    ).not.toBeVisible();
  });

  test('Share micro-rail button opens the share panel', async ({ page }) => {
    await page.getByRole('button', { name: 'Share' }).click();

    await expect(
      page.getByRole('heading', { level: 2, name: 'Share' })
    ).toBeVisible();
    // Share rail button reflects active state
    await expect(page.getByRole('button', { name: 'Share' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });
});

// ---------------------------------------------------------------------------
// Preview toggle
// ---------------------------------------------------------------------------

test.describe('CV editor — preview mode', () => {
  test.skip(!hasEditorEnv, SKIP_MSG);

  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, `/cv/${cvId}/edit`);
  });

  test('Preview button toggles aria-pressed and label', async ({ page }) => {
    const previewBtn = page.getByRole('button', { name: 'Preview' });
    await expect(previewBtn).toHaveAttribute('aria-pressed', 'false');

    await previewBtn.click();

    // Label updates to "Exit preview" and pressed flips to true
    const exitBtn = page.getByRole('button', { name: 'Exit preview' });
    await expect(exitBtn).toHaveAttribute('aria-pressed', 'true');

    // Toggle back
    await exitBtn.click();
    await expect(page.getByRole('button', { name: 'Preview' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });
});

// ---------------------------------------------------------------------------
// CV title editing
// ---------------------------------------------------------------------------

test.describe('CV editor — title editing', () => {
  test.skip(!hasEditorEnv, SKIP_MSG);

  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, `/cv/${cvId}/edit`);
  });

  test('clicking the title reveals a text input', async ({ page }) => {
    // The title is rendered in a button that contains a span.truncate
    const titleButton = page
      .locator('header button')
      .filter({ has: page.locator('span.truncate') });

    await titleButton.click();

    // Input field should now be visible in the header
    const titleInput = page.locator('header').getByRole('textbox');
    await expect(titleInput).toBeVisible();
  });

  test('Escape cancels title editing without committing', async ({ page }) => {
    const titleButton = page
      .locator('header button')
      .filter({ has: page.locator('span.truncate') });

    const originalTitle = await titleButton
      .locator('span.truncate')
      .textContent();

    await titleButton.click();

    const titleInput = page.locator('header').getByRole('textbox');
    await titleInput.fill('Temporary edit that should be cancelled');
    await titleInput.press('Escape');

    // Input is gone, original title is restored
    await expect(titleInput).not.toBeVisible();
    await expect(page.locator('span.truncate').first()).toHaveText(
      originalTitle ?? ''
    );
  });
});

// ---------------------------------------------------------------------------
// Status toggle
// ---------------------------------------------------------------------------

test.describe('CV editor — status toggle', () => {
  test.skip(!hasEditorEnv, SKIP_MSG);

  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, `/cv/${cvId}/edit`);
  });

  test('Publish / Unpublish button is visible in the header', async ({
    page,
  }) => {
    const publishBtn = page
      .locator('header')
      .getByRole('button', { name: /^(publish|unpublish)$/i });

    await expect(publishBtn).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Content panel — section wrappers (form-based template flow)
// ---------------------------------------------------------------------------

test.describe('CV editor — content panel sections', () => {
  test.skip(!hasEditorEnv, SKIP_MSG);

  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, `/cv/${cvId}/edit`);
  });

  test('Content panel lists known CV sections or inline-edit hint', async ({
    page,
  }) => {
    // Depending on the template, the Content panel either shows section forms
    // (non-inline templates) or an instruction paragraph (inline-editing templates).
    const inlineHint = page.getByText(/edit your cv directly on the document/i);
    const personalInfoSection = page.getByRole('button', {
      name: /personal info/i,
    });

    const hasInlineHint = await inlineHint.isVisible();
    const hasSections = await personalInfoSection.isVisible();

    expect(hasInlineHint || hasSections).toBe(true);
  });

  test('expanding Personal Info section reveals the form', async ({ page }) => {
    const personalInfoToggle = page.getByRole('button', {
      name: /personal info/i,
    });

    // Only applicable to non-inline-editing templates
    if (!(await personalInfoToggle.isVisible())) {
      test.skip();
      return;
    }

    // The section starts collapsed — expand it
    if ((await personalInfoToggle.getAttribute('aria-expanded')) === 'false') {
      await personalInfoToggle.click();
    }

    // Form fields should be visible
    await expect(page.getByRole('button', { name: /save/i })).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Accessibility — panel-by-panel
// ---------------------------------------------------------------------------

test.describe('CV editor — a11y by panel', () => {
  test.skip(!hasEditorEnv, SKIP_MSG);

  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, `/cv/${cvId}/edit`);
  });

  test('Analyze panel passes critical a11y checks', async ({ page }) => {
    await page.getByRole('button', { name: 'Analyze' }).click();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Analyze' })
    ).toBeVisible();
    await runA11yAudit(page);
  });

  test('Optimize panel passes critical a11y checks', async ({ page }) => {
    await page.getByRole('button', { name: 'Optimize' }).click();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Optimize' })
    ).toBeVisible();
    await runA11yAudit(page);
  });
});
