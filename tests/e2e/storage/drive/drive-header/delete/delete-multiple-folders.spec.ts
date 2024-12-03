import { test } from '@/tests/fixtures';
import { selectMultipleItems, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Delete Multiple Folders", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create and delete multiple folders", async ({ page }) => {
    // Create first folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput1 = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput1).toBeVisible();
    await expect(renameInput1).toBeFocused();
    await renameInput1.fill("Folder 1");
    await page.keyboard.press('Enter');

    // Create second folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput2 = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput2).toBeVisible();
    await expect(renameInput2).toBeFocused();
    await renameInput2.fill("Folder 2");
    await page.keyboard.press('Enter');

    // Create third folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput3 = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput3).toBeVisible();
    await expect(renameInput3).toBeFocused();
    await renameInput3.fill("Folder 3");
    await page.keyboard.press('Enter');

    // Select multiple folders using utility function
    await selectMultipleItems(page, "[data-drive-item]", [
      "Folder 1",
      "Folder 2",
      "Folder 3"
    ]);

    // Click delete button
    await page.click("[data-cy='course-drive-delete-button']");

    // Click confirm button
    await page.click('[data-cy="confirmation-dialog-confirm-button"]');

    // Verify folders are deleted
    await expect(page.locator("[data-drive-item]").filter({ hasText: "Folder 1" })).toBeHidden();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "Folder 2" })).toBeHidden();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "Folder 3" })).toBeHidden();
  });
}); 