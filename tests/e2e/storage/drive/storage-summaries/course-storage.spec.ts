import { test } from '@/tests/fixtures';
import { uploadFiles, selectMultipleItems, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Course Drive Storage Summary", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should show correct storage size after creating content block with files", async ({ page, layerId }) => {
    // Create test files by drag and drop in course drive
    await uploadFiles(page, [
      "test1.txt",
      "test2.txt",
      "test3.txt",
    ], "course-drive");

    // Verify files appear in drive
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test1.txt" })).toBeVisible();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test2.txt" })).toBeVisible();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test3.txt" })).toBeVisible();

    // Select multiple files
    await selectMultipleItems(page, "[data-drive-item]", ["test1.txt", "test2.txt", "test3.txt"]);

    // Get the learning journey wrapper
    const dropTarget = page.locator("[data-cy='learning-journey-wrapper']");

    // Wait for any upload progress indicators to disappear
    await page.locator('[data-cy="course-drive-upload-progress"]').waitFor({ state: 'detached', timeout: 30000 });

    // Simulate drag and drop of selected files
    await page.locator("[data-drive-item]").filter({ hasText: "test1.txt" }).dragTo(dropTarget);

    // Verify files appear in uppy dashboard
    await expect(page.locator(".uppy-Dashboard-Item-fileInfoAndButtons").filter({ hasText: "test1.txt" })).toBeVisible();
    await expect(page.locator(".uppy-Dashboard-Item-fileInfoAndButtons").filter({ hasText: "test2.txt" })).toBeVisible();
    await expect(page.locator(".uppy-Dashboard-Item-fileInfoAndButtons").filter({ hasText: "test3.txt" })).toBeVisible();

    // Fill in the name and description
    await page.locator("[data-cy='content-block-name-input']").fill("Test Content Block");

    // Click create content block button
    await page.locator('[data-cy="content-block-create-button"]').click();

    // Wait for uploads to complete
    await page.waitForResponse(response => 
      response.url().includes(process.env.NEXT_PUBLIC_R2_S3_API!) && response.status() === 200
    );

    // Navigate to settings and verify storage size
    await page.goto(`/dashboard/course/${layerId}/settings`);
    await expect(page).toHaveURL(`/dashboard/course/${layerId}/settings`);

    // Verify total size (72B for 3 course files in total)
    await expect(page.locator("[data-cy='course-storage-summary']")).toContainText("72 B");
  });
});
