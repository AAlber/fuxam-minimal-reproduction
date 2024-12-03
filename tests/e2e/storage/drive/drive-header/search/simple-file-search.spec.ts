import { test } from '@/tests/fixtures';
import { uploadFiles, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("File Search", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should filter and search files", async ({ page }) => {
    // Upload initial files using utility function
    await uploadFiles(page,  [
      'test.txt',
      'test2.txt',
      'test3.txt'
    ], "course-drive");

    // Wait for uploads to complete
    await page.waitForResponse(
      response => response.url().includes(process.env.S3_API!) && response.status() === 200
    );

    // Filter items by searching
    const searchInput = page.locator('[data-cy="course-drive-search"] input');
    await searchInput.click();
    await searchInput.fill('test');
    
    // Verify filtered results
    const items = page.locator("[data-drive-item]");
    await expect(items).toHaveCount(3);

    // Further filter by file extension
    await searchInput.fill('test.txt');
    await expect(items).toHaveCount(1);

    // Verify correct filtered file
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test.txt" })).toBeVisible();

    // Clear search and verify all items return
    await searchInput.clear();
    await expect(items).toHaveCount(3);
  });
}); 