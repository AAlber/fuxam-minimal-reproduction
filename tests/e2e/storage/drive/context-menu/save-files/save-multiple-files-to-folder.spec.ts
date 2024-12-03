import { test } from '@/tests/fixtures';
import { uploadFiles, selectMultipleItems, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Save Multiple Files to Folder via Context Menu", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create and save multiple files to a folder", async ({ page }) => {
    // Upload test files using utility function
    await uploadFiles(page,  [
      'test1.txt',
      'test2.txt',
      'test3.txt'
    ], "course-drive");

    // Verify files appear in list
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test1.txt" })).toBeVisible();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test2.txt" })).toBeVisible();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test3.txt" })).toBeVisible();

    // Select multiple files using utility function
    await selectMultipleItems(page, "[data-drive-item]", [
      "test1.txt",
      "test2.txt",
      "test3.txt"
    ]);

    // Right click to open context menu
    await page.locator("[data-drive-item]").filter({ hasText: "test1.txt" }).click({ button: 'right' });

    // Click save option
    await page.getByText('Save').click();

    // Click the save button
    await page.click('[data-cy="drive-save-button"]');

    // Verify the files are in the user drive
    await page.click('[data-cy="open-user-drive-button"]');
    const userDrive = page.locator('[data-drive-instance="user-drive-resizable"]');
    await expect(userDrive.locator("[data-drive-item]").filter({ hasText: "test1.txt" })).toBeVisible();
    await expect(userDrive.locator("[data-drive-item]").filter({ hasText: "test2.txt" })).toBeVisible();
    await expect(userDrive.locator("[data-drive-item]").filter({ hasText: "test3.txt" })).toBeVisible();
  });
}); 