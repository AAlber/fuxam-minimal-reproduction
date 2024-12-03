import { test } from '@/tests/fixtures';
import { uploadFiles, selectMultipleItems, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Save Multiple Files and Folders via Context Menu", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create and save multiple files and folders", async ({ page }) => {
    // Upload initial files using utility function
    await uploadFiles(page,  [
      'test1.txt',
      'test2.txt',
      'test3.txt'
    ], "course-drive");

    // Create folder with files
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput).toBeVisible();
    await expect(renameInput).toBeFocused();
    await renameInput.fill("Folder With Files");
    await page.keyboard.press('Enter');

    // Navigate into folder
    const folder = page.locator("[data-drive-item]").filter({ hasText: "Folder With Files" });
    await folder.dblclick();

    // Upload files to folder using utility function
    await uploadFiles(page, [
      'file1.txt',
      'file2.txt'
    ], "course-drive");

    // Return to root
    await page.click("[data-cy='course-drive-home-button']");

    // Select multiple items using utility function
    await selectMultipleItems(page, "[data-drive-item]", [
      "test1.txt",
      "test2.txt",
      "test3.txt",
      "Folder With Files"
    ]);

    // Right click to open context menu
    await page.locator("[data-drive-item]").filter({ hasText: "test1.txt" }).click({ button: 'right' });

    // Click save option
    await page.getByText('Save').click();

    // Click save button
    await page.click('[data-cy="drive-save-button"]');

    // Verify items in user drive
    await page.click('[data-cy="open-user-drive-button"]');
    const userDrive = page.locator('[data-drive-instance="user-drive-resizable"]');

    // Verify root files
    await expect(userDrive.locator("[data-drive-item]").filter({ hasText: "test1.txt" })).toBeVisible();
    await expect(userDrive.locator("[data-drive-item]").filter({ hasText: "test2.txt" })).toBeVisible();
    await expect(userDrive.locator("[data-drive-item]").filter({ hasText: "test3.txt" })).toBeVisible();
    await expect(userDrive.locator("[data-drive-item]").filter({ hasText: "Folder With Files" })).toBeVisible();

    // Verify folder contents
    await userDrive.locator("[data-drive-item]").filter({ hasText: "Folder With Files" }).dblclick();
    await expect(userDrive.locator("[data-drive-item]").filter({ hasText: "file1.txt" })).toBeVisible();
    await expect(userDrive.locator("[data-drive-item]").filter({ hasText: "file2.txt" })).toBeVisible();
  });
}); 