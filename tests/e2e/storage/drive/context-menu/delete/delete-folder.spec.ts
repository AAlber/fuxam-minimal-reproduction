import { test} from '@/tests/fixtures';
import { uploadFiles, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Delete Folder via Context Menu", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create and delete a folder using context menu", async ({ page }) => {
    // Create folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput).toBeVisible();
    await expect(renameInput).toBeFocused();
    await renameInput.fill("Test Folder");
    await page.keyboard.press('Enter');

    // Verify folder appears in list
    const folder = page.locator("[data-drive-item]").filter({ hasText: "Test Folder" });
    await expect(folder).toBeVisible();
    // Double click to open folder
    await folder.dblclick();

    // Upload files into the folder
    await uploadFiles(page,  [
      'test1.txt',
      'test2.txt'
    ], "course-drive");

    // Navigate back to parent folder
    await page.locator("[data-cy='course-drive-home-button']").click();

    // Right click on folder to open context menu
    await folder.click({ button: 'right' });
    
    // Click delete option
    await page.getByText('Delete').click();
    
    // Verify confirmation dialog appears and enter code
    const codeText = page.locator('[data-cy="confirmation-code-text"]');
    await expect(codeText).toBeVisible();
    
    const code = await codeText.textContent();
    if (code) {
      await page.locator('[data-input-otp="true"]').fill(code);
    }

    // Click confirm button
    await page.click('[data-cy="confirmation-dialog-confirm-button"]');

    // Verify folder is removed
    await expect(folder).toBeHidden();
  });
}); 