import { test } from '@/tests/fixtures';
import { expect } from '@playwright/test';

test.describe("Delete Nested Folders and Files", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/course-drive');
  });

  test("should create folder with nested content and root file", async ({ page }) => {
    // Create parent folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput).toBeVisible();
    await expect(renameInput).toBeFocused();
    await renameInput.type("Parent Folder");
    await page.keyboard.press('Enter');

    // Add file to root level
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'root-file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('root content')
    });

    // Navigate into parent folder and create nested content
    const parentFolder = page.locator("[data-drive-item]").filter({ hasText: "Parent Folder" });
    await parentFolder.dblclick();
    
    // Create nested folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const nestedInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(nestedInput).toBeVisible();
    await expect(nestedInput).toBeFocused();
    await nestedInput.type("Nested Folder");
    await page.keyboard.press('Enter');

    const nestedFolder = page.locator("[data-drive-item]").filter({ hasText: "Nested Folder" });
    await nestedFolder.dblclick();

    // Upload files to nested folder
    await fileInput.setInputFiles([
      {
        name: 'nested1.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('nested content 1')
      },
      {
        name: 'nested2.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('nested content 2')
      }
    ]);

    // Return to root
    await page.click("[data-cy='course-drive-home-button']");
  });

  test("should select and delete nested folder and root file", async ({ page }) => {
    // Expand parent folder
    await page.click("[data-cy='course-drive-folder-closed-icon-Parent Folder']");

    // Select nested folder and root file
    const nestedFolder = page.locator("[data-drive-item]").filter({ hasText: "Nested Folder" });
    const rootFile = page.locator("[data-drive-item]").filter({ hasText: "root-file.txt" });

    await nestedFolder.click();
    await rootFile.click({ modifiers: ['Meta'] }); // Use 'Control' for Windows

    // Click delete button
    await page.click("[data-cy='course-drive-delete-button']");

    // Verify confirmation dialog appears and enter code
    const codeText = page.locator('[data-cy="confirmation-code-text"]');
    await expect(codeText).toBeVisible();
    
    const code = await codeText.textContent();
    if (code) {
      await page.locator('[data-input-otp="true"]').type(code);
    }

    // Click confirm button
    await page.click('[data-cy="confirmation-dialog-confirm-button"]');

    // Verify only parent folder remains
    await expect(page.locator("[data-drive-item]")).toHaveCount(1);
    await expect(page.locator("[data-drive-item]").filter({ hasText: "Parent Folder" })).toBeVisible();
    await expect(rootFile).toBeHidden();
    await expect(nestedFolder).toBeHidden();
  });
}); 