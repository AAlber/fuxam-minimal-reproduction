import { test } from '@/tests/fixtures';
import { uploadFile, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Move Single File from Course Drive to User Drive", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create a file in course drive and drag it into user drive", async ({ page }) => {
    // Use utility function for file upload
    await uploadFile(page, 'test.txt', "course-drive");

    // Wait for upload to complete
    await page.waitForResponse(
      response => response.url().includes(process.env.S3_API!) && response.status() === 200
    );

    // Verify file appears in drive
    const file = page.locator("[data-drive-item]").filter({ hasText: "test.txt" });
    await expect(file).toBeVisible();

    // Open user drive
    await page.click('[data-cy="open-user-drive-button"]');

    // Get user drive wrapper
    const userDrive = page.locator('[data-drive-instance="user-drive-resizable"]');
    await expect(userDrive).toBeVisible();

    // Drag file to user drive
    await file.dragTo(userDrive);

    // Verify file appears in user drive
    await expect(userDrive.locator("[data-drive-item]").filter({ hasText: "test.txt" })).toBeVisible();
  });
}); 