import { test } from '@/tests/fixtures';
import { uploadFile, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("File Drop in Folder", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create a folder and drop file into it", async ({ page }) => {
    // Create folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput).toBeVisible();
    await expect(renameInput).toBeFocused();
    await renameInput.fill("Test Folder");
    await page.keyboard.press('Enter');

    // Get folder target
    const folder = page.locator("[data-drive-item]").filter({ hasText: "Test Folder" });
    await expect(folder).toBeVisible();

    // Use utility function for file upload
    await uploadFile(page, 'test.txt', "course-drive");

    // Wait for upload to complete
    await page.waitForResponse(
      response => response.url().includes(process.env.S3_API!) && response.status() === 200
    );

    // Drag file to folder
    const file = page.locator("[data-drive-item]").filter({ hasText: "test.txt" });
    await file.dragTo(folder);

    // Navigate into folder and verify file
    await folder.dblclick();
    await expect(file).toBeVisible();
  });
}); 