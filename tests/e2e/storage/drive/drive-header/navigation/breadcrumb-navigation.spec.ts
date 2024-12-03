import { test } from '@/tests/fixtures';
import { expect } from '@playwright/test';
import { visitCourseDrivePage } from '@/tests/helpers';

test.describe("Folder Creation and Navigation", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create new folder", async ({ page }) => {
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput).toBeVisible();
    await expect(renameInput).toBeFocused();
    await renameInput.fill("Test Folder");
    await page.keyboard.press('Enter');
    
    const folder = page.locator("[data-drive-item]").filter({ hasText: "Test Folder" });
    await expect(folder).toBeVisible();
  });

  test("should navigate into folder", async ({ page }) => {
    const folder = page.locator("[data-drive-item]").filter({ hasText: "Test Folder" });
    await folder.dblclick();
    await expect(page.locator('[data-cy="course-drive-breadcrumb-Test Folder"]')).toBeVisible();
  });

  test("should create nested folder", async ({ page }) => {
    await page.click("[data-cy='course-drive-new-folder-button']");
    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput).toBeVisible();
    await expect(renameInput).toBeFocused();
    await renameInput.fill("Nested Folder");
    await page.keyboard.press('Enter');
    
    const nestedFolder = page.locator("[data-drive-item]").filter({ hasText: "Nested Folder" });
    await expect(nestedFolder).toBeVisible();
  });

  test("should navigate into nested folder", async ({ page }) => {
    const nestedFolder = page.locator("[data-drive-item]").filter({ hasText: "Nested Folder" });
    await nestedFolder.dblclick();
    await expect(page.locator('[data-cy="course-drive-breadcrumb-Nested Folder"]')).toBeVisible();
  });

  test("should navigate back to parent folder", async ({ page }) => {
    await page.click('[data-cy="course-drive-breadcrumb-Test Folder"]');
    await expect(page.locator('[data-cy="course-drive-breadcrumb-Test Folder"]')).toBeVisible();
    const nestedFolder = page.locator("[data-drive-item]").filter({ hasText: "Nested Folder" });
    await expect(nestedFolder).toBeVisible();
  });

  test("should navigate to root", async ({ page }) => {
    await page.click('[data-cy="course-drive-home-button"]');
    const testFolder = page.locator("[data-drive-item]").filter({ hasText: "Test Folder" });
    await expect(testFolder).toBeVisible();
  });
}); 