import { test } from '@/tests/fixtures';
import { uploadFile, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Drag Single File from Course Drive into Learning Journey", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create a file in course drive and drag it into learning journey", async ({ page }) => {
    // Create test file using utility function
    await uploadFile(page, 'test.txt', "course-drive");

    // Wait for upload to complete
    await page.waitForResponse(
      response => response.url().includes(process.env.S3_API!) && response.status() === 200
    );

    // Verify file appears in drive
    const file = page.locator("[data-drive-item]").filter({ hasText: "test.txt" });
    await expect(file).toBeVisible();

    // Get the learning journey wrapper
    const dropTarget = page.locator("[data-cy='learning-journey-wrapper']");

    // Drag file to learning journey
    await file.dragTo(dropTarget);

    // Verify file appears in learning journey
    await expect(page.locator(".uppy-Dashboard-Item-fileInfoAndButtons").filter({ hasText: "test.txt" })).toBeVisible();
  });
}); 