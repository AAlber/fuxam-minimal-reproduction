import { test, } from '@/tests/fixtures';
import { uploadFiles, selectMultipleItems, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Delete Multiple Files and Folders via Context Menu", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create test files and folders then delete them together", async ({ page }) => {
    // Create parent folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput).toBeVisible();
    await expect(renameInput).toBeFocused();
    await renameInput.fill("Test Folder");
    await page.keyboard.press('Enter');

    // Use utility function for uploading multiple files
    await uploadFiles(page, [
      'test1.txt',
      'test2.txt',
      'test3.txt'
    ], "course-drive");

    // Use utility function for selecting multiple items
    await selectMultipleItems(page, "[data-drive-item]", [
      "Test Folder",
      "test1.txt",
      "test2.txt",
      "test3.txt"
    ]);

    // Right click to open context menu
    await page.locator("[data-drive-item]").filter({ hasText: "Test Folder" }).click({ button: 'right' });
    
    // Click delete option
    await page.locator('[data-cy="course-drive-menu-delete-button"]').click();
    
    // Verify confirmation dialog appears and enter code
    const codeText = page.locator('[data-cy="confirmation-code-text"]');
    await expect(codeText).toBeVisible();
    
    const code = await codeText.textContent();
    if (code) {
      await page.locator('[data-input-otp="true"]').fill(code);
    }

    // Click confirm button
    await page.click('[data-cy="confirmation-dialog-confirm-button"]');

    // Verify all items are removed
    await expect(page.locator("[data-drive-item]").filter({ hasText: "Test Folder" })).toBeHidden();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test1.txt" })).toBeHidden();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test2.txt" })).toBeHidden();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test3.txt" })).toBeHidden();
  });
}); 