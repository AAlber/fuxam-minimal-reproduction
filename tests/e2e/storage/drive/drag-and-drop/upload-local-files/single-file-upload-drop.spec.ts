import { test } from '@/tests/fixtures';
import { uploadFile, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("File Upload and Drag/Drop", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should return to root folder", async ({ page }) => {
    await page.click("[data-cy='course-drive-home-button']");
  });

  test("should allow file drag and drop", async ({ page }) => {
    // Use utility function for file upload
    await uploadFile(page,  'test.txt', "course-drive");

    // Wait for upload to complete
    await page.waitForResponse(
      response => response.url().includes(process.env.S3_API!) && response.status() === 200
    );

    // Verify file appears in drive
    const driveContainer = page.locator('[data-drive-instance="course-drive"]');
    await expect(driveContainer.locator("[data-drive-item]")).toHaveCount(1);
    await expect(driveContainer.locator("[data-drive-item]").filter({ hasText: "test.txt" })).toBeVisible();
  });
}); 