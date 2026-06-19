import { expect, test } from "@playwright/test";
import { runA11yAudit } from "./helpers/e2e-test-utils";

const publicCvSlug = process.env.E2E_PUBLIC_CV_SLUG?.trim() ?? "";

test.describe("Public CV page", () => {
  test.skip(
    !publicCvSlug,
    "Set E2E_PUBLIC_CV_SLUG to run public CV rendering checks."
  );

  test("renders shared CV and passes critical a11y checks", async ({
    page,
  }) => {
    await page.goto(`/public/cv/${publicCvSlug}`);
    await expect(page.getByText(/shared resume/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /back to prismacv/i })
    ).toBeVisible();
    await runA11yAudit(page);
  });
});
