import { test } from '@/tests/fixtures';
import { uploadFiles, selectMultipleItems, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Delete Multiple Files", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should upload and delete multiple files", async ({ page }) => {
    // Upload initial files using utility function
    await uploadFiles(page,  [
      'test1.txt',
      'test2.txt',
      'test3.txt'
    ], "course-drive");

    // Wait for uploads to complete
    await page.waitForResponse(
      response => response.url().includes(process.env.S3_API!) && response.status() === 200
    );

    // Select multiple files using utility function
    await selectMultipleItems(page, "[data-drive-item]", [
      "test1.txt",
      "test2.txt",
      "test3.txt"
    ]);

    // Click delete button
    await page.click("[data-cy='course-drive-delete-button']");

    // Click confirm button
    await page.click('[data-cy="confirmation-dialog-confirm-button"]');

    // Verify files are deleted
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test1.txt" })).toBeHidden();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test2.txt" })).toBeHidden();
    await expect(page.locator("[data-drive-item]").filter({ hasText: "test3.txt" })).toBeHidden();
  });
}); 