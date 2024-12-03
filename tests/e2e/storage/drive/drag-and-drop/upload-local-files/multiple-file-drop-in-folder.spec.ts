import { test } from '@/tests/fixtures';
import { uploadFiles, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Multiple File Drop in Folder", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create a folder and drop multiple files into it", async ({ page }) => {
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

    // Select all files
    const file1 = page.locator("[data-drive-item]").filter({ hasText: "test1.txt" });
    await file1.click();
    const file2 = page.locator("[data-drive-item]").filter({ hasText: "test2.txt" });
    await file2.click({ modifiers: ['Meta'] }); // Use 'Control' for Windows
    const file3 = page.locator("[data-drive-item]").filter({ hasText: "test3.txt" });
    await file3.click({ modifiers: ['Meta'] });

    // Drag files to folder
    await file1.dragTo(folder);

    // Navigate into folder and verify files
    await folder.dblclick();
    await expect(file1).toBeVisible();
    await expect(file2).toBeVisible();
    await expect(file3).toBeVisible();
  });
}); 