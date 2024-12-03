import { test } from '@/tests/fixtures';
import { uploadFile, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Upload Files to Subfolder", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create nested folders and upload files", async ({ page }) => {
    // Create parent folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput).toBeVisible();
    await expect(renameInput).toBeFocused();
    await renameInput.fill("Parent Folder");
    await page.keyboard.press('Enter');

    // Navigate into parent folder
    const parentFolder = page.locator("[data-drive-item]").filter({ hasText: "Parent Folder" });
    await parentFolder.dblclick();

    // Create subfolder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const subfolderInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(subfolderInput).toBeVisible();
    await expect(subfolderInput).toBeFocused();
    await subfolderInput.fill("Subfolder");
    await page.keyboard.press('Enter');

    // Navigate into subfolder
    const subfolder = page.locator("[data-drive-item]").filter({ hasText: "Subfolder" });
    await subfolder.dblclick();

    // Upload file using utility function
    await uploadFile(page,  'example.json', "course-drive");

    // Wait for upload to complete
    await page.waitForResponse(
      response => response.url().includes(process.env.S3_API!) && response.status() === 200
    );

    // Verify file appears in drive
    await expect(page.locator('[data-drive-item]').filter({ hasText: 'example.json' })).toBeVisible();
  });
}); 