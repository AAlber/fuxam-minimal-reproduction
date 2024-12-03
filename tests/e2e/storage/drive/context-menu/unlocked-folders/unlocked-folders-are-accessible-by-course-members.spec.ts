import { test } from '@/tests/fixtures';
import { uploadFiles, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Unlocked Folders Access", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should allow course members to access unlocked folders", async ({ page }) => {
    // Create parent folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput).toBeVisible();
    await expect(renameInput).toBeFocused();
    await renameInput.fill("Unlocked Folder");
    await page.keyboard.press('Enter');

    // Upload test files to folder
    const folder = page.locator("[data-drive-item]").filter({ hasText: "Unlocked Folder" });
    await folder.dblclick();

    // Use utility function for uploading multiple files
    await uploadFiles(page, [
      'test1.txt',
      'test2.txt'
    ], "course-drive");

    // Wait for uploads to complete
    await page.waitForResponse(
      response => response.url().includes(process.env.S3_API!) && response.status() === 200
    );

    // Return to root
    await page.click("[data-cy='course-drive-home-button']");

    // Right click folder to open context menu
    await folder.click({ button: 'right' });

    // Click unlock option
    await page.getByText('Unlock').click();

    // Verify unlock status
    await expect(page.locator('[data-cy="folder-unlocked-icon"]')).toBeVisible();

    // Switch to course member view
    await page.click('[data-cy="switch-to-member-view"]');

    // Verify folder is accessible
    await folder.dblclick();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test1.txt" })).toBeVisible();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test2.txt" })).toBeVisible();

    // Verify files can be downloaded
    const file = page.locator("[data-drive-item]").filter({ hasText: "test1.txt" });
    await file.click({ button: 'right' });
    
    // Start waiting for download before clicking
    const downloadPromise = page.waitForEvent('download');
    await page.getByText('Download').click();
    
    // Wait for download to start and verify
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('test1.txt');
  });
}); 