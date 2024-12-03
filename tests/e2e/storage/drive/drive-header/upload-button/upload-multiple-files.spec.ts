import { test } from '@/tests/fixtures';
import { uploadFiles, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Upload Multiple Files", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should upload multiple files to root", async ({ page }) => {
    // Use utility function for uploading multiple files
    await uploadFiles(page, [
      'example.json',
      'test1.txt',
      'test2.txt'
    ], "course-drive");

    // Wait for uploads to complete
    await page.waitForResponse(
      response => response.url().includes(process.env.S3_API!) && response.status() === 200
    );

    // Verify files appear in drive
    await expect(page.locator('[data-drive-item]').filter({ hasText: 'example.json' })).toBeVisible();
    await expect(page.locator('[data-drive-item]').filter({ hasText: 'test1.txt' })).toBeVisible();
    await expect(page.locator('[data-drive-item]').filter({ hasText: 'test2.txt' })).toBeVisible();
  });
}); 