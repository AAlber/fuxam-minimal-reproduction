import { test } from '@/tests/fixtures';
import { uploadFile, uploadFiles, selectMultipleItems, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Move Multiple Files and Folders from Course Drive to User Drive", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create multiple files and folders in course drive and drag them into user drive", async ({ page }) => {
    // Upload test files using utility function
    await uploadFiles(page,  [
      'test1.txt',
      'test2.txt',
      'test3.txt'
    ], "course-drive");

    // Create a folder
    await page.click('[data-cy="course-drive-new-folder-button"]');
    const renameInput = page.locator('[data-cy="course-drive-rename-input"]');
    await expect(renameInput).toBeVisible();
    await renameInput.fill("TestFolder");
    await page.keyboard.press('Enter');

    // Navigate into folder and upload file
    const folder = page.locator("[data-drive-item]").filter({ hasText: "TestFolder" });
    await folder.dblclick();

    // Upload file to folder using utility function
    await uploadFile(page,  'insideFolder.txt', "course-drive");

    // Wait for upload to complete
    await page.waitForResponse(
      response => response.url().includes(process.env.S3_API!) && response.status() === 200
    );

    // Return to root
    await page.click('[data-cy="course-drive-home-button"]');

    // Expand folder to see contents
    await page.click('[data-cy="course-drive-folder-closed-icon-TestFolder"]');

    // Select multiple files and folder using utility function
    await selectMultipleItems(page, "[data-drive-item]", [
      "test1.txt",
      "test2.txt",
      "test3.txt",
      "TestFolder"
    ]);

    // Open user drive
    await page.click('[data-cy="open-user-drive-button"]');
    const userDrive = page.locator('[data-drive-instance="user-drive-resizable"]');
    await expect(userDrive).toBeVisible();

    // Drag files to user drive
    await page.locator("[data-drive-item]").filter({ hasText: "test1.txt" }).dragTo(userDrive);

    // Verify files and folder appear in user drive
    await expect(userDrive.locator("[data-drive-item]").filter({ hasText: "test1.txt" })).toBeVisible();
    await expect(userDrive.locator("[data-drive-item]").filter({ hasText: "test2.txt" })).toBeVisible();
    await expect(userDrive.locator("[data-drive-item]").filter({ hasText: "test3.txt" })).toBeVisible();
    await expect(userDrive.locator("[data-drive-item]").filter({ hasText: "TestFolder" })).toBeVisible();

    // Verify folder contents
    await userDrive.locator("[data-drive-item]").filter({ hasText: "TestFolder" }).dblclick();
    await expect(userDrive.locator("[data-drive-item]").filter({ hasText: "insideFolder.txt" })).toBeVisible();
  });
}); 