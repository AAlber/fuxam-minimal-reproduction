import { test } from '@/tests/fixtures';
import { uploadFile, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Nested File Search", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create nested folder structure and search", async ({ page }) => {
    // Create top level folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput).toBeVisible();
    await expect(renameInput).toBeFocused();
    await renameInput.fill("Parent Folder");
    await page.keyboard.press('Enter');

    // Navigate into parent folder
    const parentFolder = page.locator("[data-drive-item]").filter({ hasText: "Parent Folder" });
    await expect(parentFolder).toBeVisible();
    await parentFolder.dblclick();

    // Create middle folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const middleFolderInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(middleFolderInput).toBeVisible();
    await page.waitForTimeout(300);
    await middleFolderInput.fill("Middle Folder");
    await page.keyboard.press('Enter');

    // Navigate into middle folder
    const middleFolder = page.locator("[data-drive-item]").filter({ hasText: "Middle Folder" });
    await middleFolder.dblclick();

    // Create deepest folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const deepFolderInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(deepFolderInput).toBeVisible();
    await page.waitForTimeout(300);
    await deepFolderInput.fill("Deep Folder");
    await page.keyboard.press('Enter');

    // Navigate into deep folder
    const deepFolder = page.locator("[data-drive-item]").filter({ hasText: "Deep Folder" });
    await deepFolder.dblclick();

    // Upload test file using utility function
    await uploadFile(page,  'nested-test.txt', "course-drive");

    // Return to root
    await page.click("[data-cy='course-drive-home-button']");

    // Search for folder by name
    const searchInput = page.locator('[data-cy="course-drive-search"] input');
    await searchInput.click();
    await searchInput.fill("Middle");
    await expect(page.locator("[data-drive-item]")).toHaveCount(1);
    
    // Expand parent folder to see middle folder
    await page.click("[data-cy='course-drive-folder-closed-icon-Parent Folder']");
    await expect(page.locator("[data-drive-item]").filter({ hasText: "Middle Folder" })).toBeVisible();

    // Search for nested file
    await searchInput.clear();
    await searchInput.fill("nested-test");
    await expect(page.locator("[data-drive-item]")).toHaveCount(2);
    
    // Expand folders to find file
    await page.click("[data-cy='course-drive-folder-closed-icon-Middle Folder']");
    await page.click("[data-cy='course-drive-folder-closed-icon-Deep Folder']");
    await expect(page.locator("[data-drive-item]").filter({ hasText: "nested-test.txt" })).toBeVisible();

    // Clear search and verify all items return
    await searchInput.clear();
    await page.click("[data-cy='course-drive-home-button']");
    await expect(page.locator("[data-drive-item]")).toHaveCount(4);
  });
}); 