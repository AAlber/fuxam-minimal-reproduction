import { test, } from '@/tests/fixtures';
import { uploadFile, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Delete File via Context Menu", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create and delete a file using context menu", async ({ page }) => {
    // Use utility function for file upload
    await uploadFile(page, 'test.txt', "course-drive");

    // Verify file appears in drive
    const file = page.locator("[data-drive-item]").filter({ hasText: "test.txt" });
    await expect(file).toBeVisible();

    // Right click on file to open context menu
    await file.click({ button: 'right' });
    
    // Click delete option
    await page.getByText('Delete').click();

    // Click confirm button
    await page.click('[data-cy="confirmation-dialog-confirm-button"]');

    // Verify file is removed
    await expect(file).toBeHidden();
  });
}); 