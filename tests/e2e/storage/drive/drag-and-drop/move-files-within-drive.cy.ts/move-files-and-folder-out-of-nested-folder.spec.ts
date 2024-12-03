import { test } from '@/tests/fixtures';
import { uploadFile, uploadFiles, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Move Files and Folder out of Nested Folder", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create parent folder", async ({ page }) => {
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput).toBeVisible();
    await expect(renameInput).toBeFocused();
    await renameInput.fill("Parent Folder");
    await page.keyboard.press('Enter');
  });

  test("should create nested folder and add files", async ({ page }) => {
    // Navigate into parent folder
    const parentFolder = page.locator("[data-drive-item]").filter({ hasText: "Parent Folder" });
    await parentFolder.dblclick();

    // Create nested folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const nestedInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(nestedInput).toBeVisible();
    await expect(nestedInput).toBeFocused();
    await nestedInput.fill("Nested Folder");
    await page.keyboard.press('Enter');

    // Navigate into nested folder
    const nestedFolder = page.locator("[data-drive-item]").filter({ hasText: "Nested Folder" });
    await nestedFolder.dblclick();

    // Upload files to nested folder using utility function
    await uploadFiles(page,  [
      'nested-file1.txt',
      'nested-file2.txt'
    ], "course-drive");

    // Return to root
    await page.click("[data-cy='course-drive-home-button']");
  });

  test("should move all contents out of parent folder to root", async ({ page }) => {
    // Return to root
    await page.click("[data-cy='course-drive-home-button']");

    // Expand the Parent Folder
    await page.click("[data-cy='course-drive-folder-closed-icon-Parent Folder']");

    // Get nested folder and drag to root drive
    const nestedFolder = page.locator("[data-drive-item]").filter({ hasText: "Nested Folder" });
    const courseDrive = page.locator('[data-drive-instance="course-drive"]');

    // Drag nested folder to root
    await nestedFolder.dragTo(courseDrive);

    // Verify items are now at root level
    await expect(page.locator("[data-drive-item]")).toHaveCount(2);
    await expect(nestedFolder).toBeVisible();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "Parent Folder" })).toBeVisible();
  });
}); 