import { test } from '@/tests/fixtures';
import { uploadFiles, selectMultipleItems, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Drag Multiple Files from Course Drive into Learning Journey", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create multiple files in course drive and drag them into learning journey", async ({ page }) => {
    // Upload test files using utility function
    await uploadFiles(page,  [
      'test1.txt',
      'test2.txt',
      'test3.txt'
    ], "course-drive");

    // Wait for uploads to complete
    await page.waitForResponse(
      response => response.url().includes(process.env.S3_API!) && response.status() === 200
    );

    // Verify files appear in drive
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test1.txt" })).toBeVisible();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test2.txt" })).toBeVisible();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test3.txt" })).toBeVisible();

    // Select multiple files using utility function
    await selectMultipleItems(page, "[data-drive-item]", [
      "test1.txt",
      "test2.txt",
      "test3.txt"
    ]);

    // Get the learning journey wrapper
    const dropTarget = page.locator("[data-cy='learning-journey-wrapper']");

    // Drag files to learning journey
    await page.locator("[data-drive-item]").filter({ hasText: "test1.txt" }).dragTo(dropTarget);

    // Verify files appear in learning journey
    await expect(page.locator(".uppy-Dashboard-Item-fileInfoAndButtons").filter({ hasText: "test1.txt" })).toBeVisible();
    await expect(page.locator(".uppy-Dashboard-Item-fileInfoAndButtons").filter({ hasText: "test2.txt" })).toBeVisible();
    await expect(page.locator(".uppy-Dashboard-Item-fileInfoAndButtons").filter({ hasText: "test3.txt" })).toBeVisible();
  });
}); 