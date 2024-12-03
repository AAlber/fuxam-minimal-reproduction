import { test } from '@/tests/fixtures';
import { expect } from '@playwright/test';
import { visitCourseDrivePage } from '@/tests/helpers';

test.describe("Arrow Navigation Between Folders", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create folders with nested structure", async ({ page }) => {
    // Create first folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput).toBeVisible();
    await expect(renameInput).toBeFocused();
    await renameInput.fill("Folder 1");
    await page.keyboard.press('Enter');

    // Navigate into first folder and create nested folder
    const folder1 = page.locator("[data-drive-item]").filter({ hasText: "Folder 1" });
    await folder1.dblclick();
    
    await page.click("[data-cy='course-drive-new-folder-button']");
    const nestedInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(nestedInput).toBeVisible();
    await expect(nestedInput).toBeFocused();
    await nestedInput.fill("Nested Folder 1");
    await page.keyboard.press('Enter');

    // Navigate into nested folder and create sub-nested folder
    const nestedFolder = page.locator("[data-drive-item]").filter({ hasText: "Nested Folder 1" });
    await nestedFolder.dblclick();
    
    await page.click("[data-cy='course-drive-new-folder-button']");
    const subNestedInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(subNestedInput).toBeVisible();
    await expect(subNestedInput).toBeFocused();
    await subNestedInput.fill("Sub-Nested Folder");
    await page.keyboard.press('Enter');

    // Return to root
    await page.click("[data-cy='course-drive-home-button']");

    // Create second folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const folder2Input = page.locator("[data-cy='course-drive-rename-input']");
    await expect(folder2Input).toBeVisible();
    await expect(folder2Input).toBeFocused();
    await folder2Input.fill("Folder 2");
    await page.keyboard.press('Enter');
  });

  test("should navigate forward through folders using arrows", async ({ page }) => {
    // Navigate into first folder
    const folder1 = page.locator("[data-drive-item]").filter({ hasText: "Folder 1" });
    await folder1.dblclick();
    
    // Navigate into nested folder
    const nestedFolder = page.locator("[data-drive-item]").filter({ hasText: "Nested Folder 1" });
    await nestedFolder.dblclick();
    
    // Navigate into sub-nested folder
    const subNestedFolder = page.locator("[data-drive-item]").filter({ hasText: "Sub-Nested Folder" });
    await subNestedFolder.dblclick();
  });

  test("should navigate backward through folders using arrows", async ({ page }) => {
    // Navigate back to nested folder
    await page.click("[data-cy='course-drive-back-button']");
    const subNestedFolder = page.locator("[data-drive-item]").filter({ hasText: "Sub-Nested Folder" });
    await expect(subNestedFolder).toBeVisible();
    
    // Navigate back to first folder
    await page.click("[data-cy='course-drive-back-button']");
    const nestedFolder = page.locator("[data-drive-item]").filter({ hasText: "Nested Folder 1" });
    await expect(nestedFolder).toBeVisible();
    
    // Navigate back to root
    await page.click("[data-cy='course-drive-back-button']");
    const folder1 = page.locator("[data-drive-item]").filter({ hasText: "Folder 1" });
    const folder2 = page.locator("[data-drive-item]").filter({ hasText: "Folder 2" });
    await expect(folder1).toBeVisible();
    await expect(folder2).toBeVisible();
  });

  test("should navigate forward again using forward arrow", async ({ page }) => {
    // Navigate forward to first folder
    await page.click("[data-cy='course-drive-forward-button']");
    const nestedFolder = page.locator("[data-drive-item]").filter({ hasText: "Nested Folder 1" });
    await expect(nestedFolder).toBeVisible();
    
    // Navigate forward to nested folder
    await page.click("[data-cy='course-drive-forward-button']");
    const subNestedFolder = page.locator("[data-drive-item]").filter({ hasText: "Sub-Nested Folder" });
    await expect(subNestedFolder).toBeVisible();
    
    // Navigate forward to sub-nested folder
    await page.click("[data-cy='course-drive-forward-button']");
    
    // Verify forward button is disabled at deepest level
    const forwardButton = page.locator("[data-cy='course-drive-forward-button']");
    await expect(forwardButton).toBeDisabled();
  });

  test("should navigate back to deeply nested folder after using home button", async ({ page }) => {
    // Click home button
    await page.click("[data-cy='course-drive-home-button']");
    const folder1 = page.locator("[data-drive-item]").filter({ hasText: "Folder 1" });
    const folder2 = page.locator("[data-drive-item]").filter({ hasText: "Folder 2" });
    await expect(folder1).toBeVisible();
    await expect(folder2).toBeVisible();
    
    // Navigate forward to first folder
    await page.click("[data-cy='course-drive-forward-button']");
    const nestedFolder = page.locator("[data-drive-item]").filter({ hasText: "Nested Folder 1" });
    await expect(nestedFolder).toBeVisible();
    
    // Navigate forward to nested folder
    await page.click("[data-cy='course-drive-forward-button']");
    const subNestedFolder = page.locator("[data-drive-item]").filter({ hasText: "Sub-Nested Folder" });
    await expect(subNestedFolder).toBeVisible();
    
    // Navigate forward to sub-nested folder
    await page.click("[data-cy='course-drive-forward-button']");
    
    // Verify we're in the deepest level
    const forwardButton = page.locator("[data-cy='course-drive-forward-button']");
    await expect(forwardButton).toBeDisabled();
  });
}); 