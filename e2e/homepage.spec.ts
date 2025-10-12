import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    // Navigate to the homepage
    const response = await page.goto('/');

    // Check if the page loads without errors
    expect(response?.status()).toBe(200);

    // Check if the page has a title (any title is fine for now)
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);

    // Check for main navigation or key elements
    await expect(page.locator('body')).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have proper accessibility', async ({ page }) => {
    await page.goto('/');

    // Basic accessibility checks
    const title = await page.title();
    expect(title).toBeTruthy();

    // Check for proper heading structure
    const h1 = page.locator('h1');
    if ((await h1.count()) > 0) {
      await expect(h1.first()).toBeVisible();
    }
  });
});
