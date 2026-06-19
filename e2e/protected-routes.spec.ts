import { test, expect } from "@playwright/test";

test.describe("Protected Routes", () => {
  const protectedRoutes = [
    { path: "/jobs", name: "Jobs" },
    { path: "/skills", name: "Skills" },
    { path: "/interview", name: "Interview" },
    { path: "/dashboard", name: "Dashboard" },
  ];

  for (const route of protectedRoutes) {
    test(`${route.name} page should redirect unauthenticated users to login`, async ({
      page,
    }) => {
      await page.goto(route.path);

      // Should redirect to login
      await page.waitForURL(/\/login/);
      expect(page.url()).toContain("/login");
      expect(page.url()).toContain(
        `redirect=${encodeURIComponent(route.path)}`
      );
    });
  }

  test("should preserve query params in redirect", async ({ page }) => {
    await page.goto("/jobs?status=APPLIED");

    await page.waitForURL(/\/login/);
    const url = new URL(page.url());
    const redirect = url.searchParams.get("redirect");
    expect(redirect).toContain("/jobs");
  });
});
