import { test } from '@/tests/fixtures';
import { uploadFile, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Move Single File into Folder", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should upload initial file", async ({ page }) => {
    // Use utility function for file upload
    await uploadFile(page,  'test.txt', "course-drive");

    // Wait for upload to complete
    await page.waitForResponse(
      response => response.url().includes(process.env.S3_API!) && response.status() === 200
    );
  });

  test("should create a folder", async ({ page }) => {
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput).toBeVisible();
    await expect(renameInput).toBeFocused();
    await renameInput.fill("Test Folder");
    await page.keyboard.press('Enter');
  });

  test("should drag file into folder", async ({ page }) => {
    // Get source and target elements
    const file = page.locator("[data-drive-item]").filter({ hasText: "test.txt" });
    const folder = page.locator("[data-drive-item]").filter({ hasText: "Test Folder" });

    // Drag file to folder
    await file.dragTo(folder);

    // Navigate into folder and verify file
    await folder.dblclick();
    await expect(file).toBeVisible();
  });
}); 