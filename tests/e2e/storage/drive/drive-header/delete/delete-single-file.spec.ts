import { test } from '@/tests/fixtures';
import { uploadFile, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Delete Single File", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should upload and delete a single file", async ({ page }) => {
    // Upload initial file using utility function
    await uploadFile(page,  'test.txt', "course-drive");

    // Wait for upload to complete
    await page.waitForResponse(
      response => response.url().includes(process.env.S3_API!) && response.status() === 200
    );

    // Select the file
    const file = page.locator("[data-drive-item]").filter({ hasText: "test.txt" });
    await file.click();

    // Click delete button
    await page.click("[data-cy='course-drive-delete-button']");

    // Click confirm button
    await page.click('[data-cy="confirmation-dialog-confirm-button"]');

    // Verify file is deleted
    await expect(file).toBeHidden();
  });
}); 