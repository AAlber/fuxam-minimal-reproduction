import { test } from '@/tests/fixtures';
import { uploadFiles, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Multiple File Upload and Drag/Drop", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should allow multiple file drag and drop", async ({ page }) => {
    // Use utility function for uploading multiple files
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
    const driveContainer = page.locator('[data-drive-instance="course-drive"]');
    await expect(driveContainer.locator("[data-drive-item]")).toHaveCount(3);
    await expect(driveContainer.locator("[data-drive-item]").filter({ hasText: "test1.txt" })).toBeVisible();
    await expect(driveContainer.locator("[data-drive-item]").filter({ hasText: "test2.txt" })).toBeVisible();
    await expect(driveContainer.locator("[data-drive-item]").filter({ hasText: "test3.txt" })).toBeVisible();
  });
}); 