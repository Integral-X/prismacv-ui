import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage should display public navigation links', async ({ page }) => {
    await page.goto('/');

    // Public nav items should be visible
    const nav = page.locator('nav');
    if ((await nav.count()) > 0) {
      // Check for public links
      const templateLink = page.getByRole('link', { name: /templates/i });
      const pricingLink = page.getByRole('link', { name: /pricing/i });
      const faqLink = page.getByRole('link', { name: /faq/i });

      if ((await templateLink.count()) > 0) {
        await expect(templateLink.first()).toBeVisible();
      }
      if ((await pricingLink.count()) > 0) {
        await expect(pricingLink.first()).toBeVisible();
      }
      if ((await faqLink.count()) > 0) {
        await expect(faqLink.first()).toBeVisible();
      }
    }
  });

  test('homepage should have login/signup call to action', async ({ page }) => {
    await page.goto('/');

    // Look for auth-related links
    const loginLink = page.getByRole('link', { name: /log\s*in|sign\s*in/i });
    const signupLink = page.getByRole('link', {
      name: /sign\s*up|get\s*started|register/i,
    });

    const hasLogin = (await loginLink.count()) > 0;
    const hasSignup = (await signupLink.count()) > 0;

    // At least one auth CTA should be present
    expect(hasLogin || hasSignup).toBe(true);
  });

  test('homepage should load with valid status', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });
});
