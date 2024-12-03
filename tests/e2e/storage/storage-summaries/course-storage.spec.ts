import { test } from '@/tests/fixtures';
import { uploadFiles, selectMultipleItems, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe('Course Drive Storage Summary', () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test('should show correct storage size after creating content block with files', async ({ page }) => {
    // Intercept PUT requests
    await page.route(`${process.env.S3_API}/**`, route => route.fulfill());

    // Use utility function for file drag and drop
    await uploadFiles(page,  [
      "test1.txt",
      "test2.txt",
      "test3.txt",
    ], "course-drive");

    // Verify files appear in drive
    await expect(page.locator("[data-drive-item]").getByText("test1.txt")).toBeVisible();
    await expect(page.locator("[data-drive-item]").getByText("test2.txt")).toBeVisible();
    await expect(page.locator("[data-drive-item]").getByText("test3.txt")).toBeVisible();

    // Use utility function for selecting multiple files
    await selectMultipleItems(page, "[data-drive-item]", [
      "test1.txt",
      "test2.txt",
      "test3.txt"
    ]);

    // Get the learning journey wrapper
    const dropTarget = page.locator("[data-cy='learning-journey-wrapper']");

    // Simulate drag and drop of selected files
    await page.locator("[data-drive-item]").getByText("test1.txt").dragTo(dropTarget);

    // Verify files appear in uppy dashboard
    await expect(page.locator(".uppy-Dashboard-Item-fileInfoAndButtons").getByText("test1.txt")).toBeVisible();
    await expect(page.locator(".uppy-Dashboard-Item-fileInfoAndButtons").getByText("test2.txt")).toBeVisible();
    await expect(page.locator(".uppy-Dashboard-Item-fileInfoAndButtons").getByText("test3.txt")).toBeVisible();

    // Fill in the name and description
    await page.locator("[data-cy='content-block-name-input']").fill("Test Content Block");

    // Click create content block button
    await page.locator('[data-cy="content-block-create-button"]').click();

    // Navigate to settings and verify storage size
    await page.goto(`/dashboard/course/${process.env.LAYER_ID}/settings`);
    await expect(page).toHaveURL(`/dashboard/course/${process.env.LAYER_ID}/settings`);

    // Verify total size (72B for 3 course files in total)
    await expect(page.locator("[data-cy='course-storage-summary']")).toContainText("72 B");
  });
});
