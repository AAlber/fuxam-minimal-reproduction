import { test } from '@/tests/fixtures';
import { uploadFiles, selectMultipleItems, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Move Files and Folders into Folder", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should upload initial files", async ({ page }) => {
    // Use utility function for uploading multiple files
    await uploadFiles(page,  [
      'test1.txt',
      'test2.txt',
      'test3.txt',
      'test4.txt'
    ], "course-drive");

    // Wait for uploads to complete
    await page.waitForResponse(
      response => response.url().includes(process.env.S3_API!) && response.status() === 200
    );
  });

  test("should create source folder and target folder", async ({ page }) => {
    // Create source folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const sourceInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(sourceInput).toBeVisible();
    await expect(sourceInput).toBeFocused();
    await sourceInput.fill("Source Folder");
    await page.keyboard.press('Enter');

    // Create target folder
    await page.click("[data-cy='course-drive-new-folder-button']");
    const targetInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(targetInput).toBeVisible();
    await expect(targetInput).toBeFocused();
    await targetInput.fill("Target Folder");
    await page.keyboard.press('Enter');
  });

  test("should move two files into source folder", async ({ page }) => {
    // Select files
    await selectMultipleItems(page, "[data-drive-item]", [
      "test1.txt",
      "test2.txt"
    ]);

    // Get source folder and drag files to it
    const sourceFolder = page.locator("[data-drive-item]").filter({ hasText: "Source Folder" });
    await page.locator("[data-drive-item]").filter({ hasText: "test1.txt" }).dragTo(sourceFolder);
  });

  test("should select and drag source folder and two files into target folder", async ({ page }) => {
    // Select source folder and remaining files
    await selectMultipleItems(page, "[data-drive-item]", [
      "Source Folder",
      "test3.txt",
      "test4.txt"
    ]);

    // Get target folder and drag items to it
    const targetFolder = page.locator("[data-drive-item]").filter({ hasText: "Target Folder" });
    await page.locator("[data-drive-item]").filter({ hasText: "Source Folder" }).dragTo(targetFolder);
  });

  test("should show correct items in target folder", async ({ page }) => {
    const targetFolder = page.locator("[data-drive-item]").filter({ hasText: "Target Folder" });
    await targetFolder.dblclick();

    await expect(page.locator("[data-drive-item]")).toHaveCount(3);
    await expect(page.locator("[data-drive-item]").filter({ hasText: "Source Folder" })).toBeVisible();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test3.txt" })).toBeVisible();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test4.txt" })).toBeVisible();
  });

  test("should show correct files in source folder within target folder", async ({ page }) => {
    const sourceFolder = page.locator("[data-drive-item]").filter({ hasText: "Source Folder" });
    await sourceFolder.dblclick();

    await expect(page.locator("[data-drive-item]")).toHaveCount(2);
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test1.txt" })).toBeVisible();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test2.txt" })).toBeVisible();
  });
}); 