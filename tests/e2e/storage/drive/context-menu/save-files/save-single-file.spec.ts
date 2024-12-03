import { test } from '@/tests/fixtures';
import { uploadFile, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Save Single File via Context Menu", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create and save a file", async ({ page }) => {
    // Use utility function for file upload
    await uploadFile(page, 'test1.txt', "course-drive");

    // Wait for upload
    await page.waitForResponse(
      response => response.url().includes(process.env.S3_API!) && response.status() === 200
    );

    // Verify file appears in list
    const file = page.locator("[data-drive-item]").filter({ hasText: "test1.txt" });
    await expect(file).toBeVisible();

    // Right click to open context menu
    await file.click({ button: 'right' });

    // Click save option
    await page.getByText('Save').click();

    // Click the save button
    await page.click('[data-cy="drive-save-button"]');

    // Verify the file is in the user drive
    await page.click('[data-cy="open-user-drive-button"]');
    const userDrive = page.locator('[data-drive-instance="user-drive-resizable"]');
    const savedFile = userDrive.locator("[data-drive-item]").filter({ hasText: "test1.txt" });
    await expect(savedFile).toBeVisible();
  });
}); 