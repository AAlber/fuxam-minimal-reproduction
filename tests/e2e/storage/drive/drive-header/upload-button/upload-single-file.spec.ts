import { test } from '@/tests/fixtures';
import { uploadFile, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Upload Single File", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should upload single file to root", async ({ page }) => {
    // Use utility function for file upload
    await page.click('[data-cy="course-drive-upload-button"]');

    // Create file and set up file chooser
    const fileData = {
      name: 'example.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{"key": "value"}'),
    };

    // Handle file upload
    await page.locator('.uppy-Dashboard-input').first().setInputFiles([fileData]);

    // Wait for upload to complete
    await page.waitForResponse(
      response => 
        response.url().includes('fuxam-r2-bucket.d7cea93cb0b0fa7c6f98e336cecb5dec.r2.cloudflarestorage.com') && 
        response.status() === 200
    );

    // Verify file appears in drive
    const file = page.locator('[data-drive-item]').filter({ hasText: 'example.json' });
    await expect(file).toBeVisible();
  });
}); 