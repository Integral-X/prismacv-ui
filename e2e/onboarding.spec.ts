import { expect, test } from "@playwright/test";
import {
  expectRedirectToLogin,
  hasLoginCredentials,
  loginAsTestUser,
  runA11yAudit,
} from "./helpers/e2e-test-utils";

const onboardingProtectedPaths = [
  "/onboarding",
  "/onboarding/upload-cv",
  "/onboarding/import-linkedin",
  "/onboarding/select-template",
];

const onboardingFlowPaths = [
  {
    path: "/onboarding/upload-cv",
    heading: /bring your cv/i,
  },
  {
    path: "/onboarding/import-linkedin",
    heading: /import from linkedin/i,
  },
  {
    path: "/onboarding/select-template",
    heading: /job-winning templates for you/i,
  },
];

test.describe("Onboarding flows", () => {
  for (const path of onboardingProtectedPaths) {
    test(`redirects unauthenticated users from ${path}`, async ({ page }) => {
      await expectRedirectToLogin(page, path);
    });
  }

  test.describe("Authenticated onboarding pages", () => {
    test.skip(
      !hasLoginCredentials,
      "Set E2E_TEST_USER_EMAIL and E2E_TEST_USER_PASSWORD to run authenticated onboarding checks."
    );

    for (const flow of onboardingFlowPaths) {
      test(`loads ${flow.path} and passes critical a11y checks`, async ({
        page,
      }) => {
        await loginAsTestUser(page, flow.path);
        await expect(
          page.getByRole("heading", { level: 1, name: flow.heading })
        ).toBeVisible();
        await runA11yAudit(page);
      });
    }
  });
});
