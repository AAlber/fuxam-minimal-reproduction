import { test } from '@/tests/fixtures';
import { uploadFiles, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Course Drive Storage Summary", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should show correct folder sizes when adding files", async ({ page }) => {
    // Create root level folders
    await page.click("[data-cy='course-drive-new-folder-button']");
    await page.locator("[data-cy='course-drive-rename-input']").waitFor({ state: "visible" });
    await page.locator("[data-cy='course-drive-rename-input']").fill("Folder 1");
    await page.keyboard.press('Enter');

    await page.click("[data-cy='course-drive-new-folder-button']");
    await page.locator("[data-cy='course-drive-rename-input']").waitFor({ state: "visible" });
    await page.locator("[data-cy='course-drive-rename-input']").fill("Folder 2");
    await page.keyboard.press('Enter');

    // Add files to Folder 1
    await page.locator("[data-drive-item]").filter({ hasText: "Folder 1" }).dblclick();
    await uploadFiles(page, [
      "test1.txt",
      "test2.txt",
      "test3.txt"
    ], "course-drive");

    // Create subfolder in Folder 1
    await page.click("[data-cy='course-drive-new-folder-button']");
    await page.locator("[data-cy='course-drive-rename-input']").waitFor({ state: "visible" });
    await page.locator("[data-cy='course-drive-rename-input']").fill("Subfolder 1");
    await page.keyboard.press('Enter');
    
    await page.locator("[data-drive-item]").filter({ hasText: "Subfolder 1" }).dblclick();

    await uploadFiles(page, [
      "subtest1.txt",
      "subtest2.txt"
    ], "course-drive");
    
    // Return to root
    await page.click("[data-cy='course-drive-home-button']");

    // Expand Folder 1 by clicking folder icon
    await page.click('[data-cy="course-drive-folder-closed-icon-Folder 1"]');

    // Expand Subfolder 1 by clicking folder icon
    await page.click('[data-cy="course-drive-folder-closed-icon-Subfolder 1"]');

    // Wait for uploads to complete
    await page.waitForSelector('[data-cy="course-drive-upload-progress"]', { state: 'detached', timeout: 30000 });
    
    // Verify Subfolder 1 size (2 files = 24 bytes)
    await expect(page.locator('[data-cy="drive-item-size-Subfolder 1"]')).toContainText("24 B");
    
    // Verify Folder 1 size (3 direct files + 2 subfolder files = 60 bytes)
    await expect(page.locator('[data-cy="drive-item-size-Folder 1"]')).toContainText("60 B");
  });

  test("should show correct folder sizes when going to course settings", async ({ page, layerId }) => {
    await page.goto(`/dashboard/course/${layerId}/settings`);
    await expect(page).toHaveURL(`/dashboard/course/${layerId}/settings`);
    //60B for the files + 15B for the 3 subfolders
    await expect(page.locator("[data-cy='course-storage-summary']")).toContainText("75 B");
  });
});
