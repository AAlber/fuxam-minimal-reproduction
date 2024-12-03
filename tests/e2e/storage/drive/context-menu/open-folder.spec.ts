import { test } from '@/tests/fixtures';
import { visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Open Folder via Context Menu", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create and open a folder using context menu", async ({ page }) => {
    // Create folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await renameInput.waitFor({state: 'visible'});
    await renameInput.fill("Test Folder");
    await page.keyboard.press('Enter');

    // Verify folder appears in list
    const folder = page.locator("[data-drive-item]").filter({ hasText: "Test Folder" });
    await expect(folder).toBeVisible();

    // Right click on folder to open context menu
    await folder.click({ button: 'right' });
    
    // Click open option
    await page.click('[data-cy="course-drive-open-button"]');

    // Verify we're inside the folder by checking breadcrumb
    await expect(page.locator('[data-cy="course-drive-breadcrumb-Test Folder"]')).toBeVisible();
  });
}); 