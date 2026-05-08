import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

const testUserEmail = process.env.E2E_TEST_USER_EMAIL?.trim() ?? '';
const testUserPassword = process.env.E2E_TEST_USER_PASSWORD?.trim() ?? '';

export const loginCredentials = {
  email: testUserEmail,
  password: testUserPassword,
};

export const hasLoginCredentials = Boolean(
  loginCredentials.email && loginCredentials.password
);

export async function loginAsTestUser(
  page: Page,
  redirectPath = '/dashboard'
): Promise<void> {
  if (!hasLoginCredentials) {
    throw new Error(
      'Missing E2E_TEST_USER_EMAIL/E2E_TEST_USER_PASSWORD credentials.'
    );
  }

  await page.goto(`/login?redirect=${encodeURIComponent(redirectPath)}`);
  await expect(page.getByLabel('Email')).toBeVisible();
  await page.getByLabel('Email').fill(loginCredentials.email);
  await page.getByLabel('Password').fill(loginCredentials.password);

  await Promise.all([
    page.waitForURL(
      (url) => !url.pathname.startsWith('/login') && url.pathname !== '/',
      { timeout: 20_000 }
    ),
    page.getByRole('button', { name: /^login$/i }).click(),
  ]);
}

export async function expectRedirectToLogin(
  page: Page,
  protectedPath: string
): Promise<void> {
  await page.goto(protectedPath);
  await page.waitForURL(/\/login/);

  const currentUrl = new URL(page.url());
  expect(currentUrl.pathname).toBe('/login');
  expect(currentUrl.searchParams.get('redirect')).toBe(protectedPath);
}

export async function runA11yAudit(page: Page): Promise<void> {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  const seriousViolations = violations.filter(
    ({ impact }) => impact === 'critical' || impact === 'serious'
  );

  const violationSummary = seriousViolations
    .map(
      ({ id, impact, nodes }) =>
        `${id} [${impact ?? 'unknown'}] on ${nodes.length} node(s)`
    )
    .join(', ');

  expect(
    seriousViolations,
    `A11y violations found: ${violationSummary || 'none'}`
  ).toEqual([]);
}
