import { test } from '@/tests/fixtures';
import { uploadFiles, selectMultipleItems, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Move Multiple Files into Folder", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should upload initial files", async ({ page }) => {
    // Use utility function for uploading multiple files
    await uploadFiles(page, [
      'test1.txt',
      'test2.txt',
      'test3.txt',
      'test4.txt'
    ], "course-drive");

    // Wait for uploads to complete
    await page.waitForResponse(
      response => response.url().includes(process.env.S3_API!) && response.status() === 200
    );
  });

  test("should create source folder and target folder", async ({ page }) => {
    // Create source folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const sourceInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(sourceInput).toBeVisible();
    await expect(sourceInput).toBeFocused();
    await sourceInput.fill("Source Folder");
    await page.keyboard.press('Enter');

    // Create target folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const targetInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(targetInput).toBeVisible();
    await expect(targetInput).toBeFocused();
    await targetInput.fill("Target Folder");
    await page.keyboard.press('Enter');
  });

  test("should select and drag multiple files into folder", async ({ page }) => {
    // Use utility function to select multiple files
    await selectMultipleItems(page, "[data-drive-item]", [
      "test1.txt",
      "test2.txt",
      "test3.txt",
      "test4.txt"
    ]);

    // Get target folder
    const targetFolder = page.locator("[data-drive-item]").filter({ hasText: "Target Folder" });

    // Drag files to target folder
    await page.locator("[data-drive-item]").filter({ hasText: "test1.txt" }).dragTo(targetFolder);

    // Navigate into folder and verify files
    await targetFolder.dblclick();
    await expect(page.locator("[data-drive-item]")).toHaveCount(4);
  });
}); 