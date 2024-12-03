import { test } from '@/tests/fixtures';
import { uploadFiles, uploadFile, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Rename Folder via Context Menu", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create folder structure and rename parent folder", async ({ page }) => {
    // Create parent folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput).toBeVisible();
    await expect(renameInput).toBeFocused();
    await renameInput.fill("Test Folder");
    await page.keyboard.press('Enter');

    // Navigate into folder
    const folder = page.locator("[data-drive-item]").filter({ hasText: "Test Folder" });
    await folder.dblclick();

    // Create files using utility function
    await uploadFiles(page, [
      'test1.txt',
      'test2.txt'
    ], "course-drive");

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

    // Upload file to subfolder using utility function
    await uploadFile(page, 'subfile.txt', "course-drive");

    // Navigate back to root
    await page.click("[data-cy='course-drive-home-button']");

    // Right click parent folder and rename
    await folder.click({ button: 'right' });
    await page.getByText('Rename').click();
    
    const parentRenameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(parentRenameInput).toBeVisible();
    await page.waitForTimeout(300); // Wait for animation
    await parentRenameInput.fill("Renamed Folder");
    await page.keyboard.press('Enter');

    // Verify folder was renamed
    const renamedFolder = page.locator("[data-drive-item]").filter({ hasText: "Renamed Folder" });
    await expect(renamedFolder).toBeVisible();

    // Navigate into renamed folder and verify contents
    await renamedFolder.dblclick();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test1.txt" })).toBeVisible();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test2.txt" })).toBeVisible();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "Subfolder" })).toBeVisible();

    // Check subfolder contents
    await subfolder.dblclick();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "subfile.txt" })).toBeVisible();
  });
}); 