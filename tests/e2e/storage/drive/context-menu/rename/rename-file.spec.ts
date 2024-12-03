import { test } from '@/tests/fixtures';
import { uploadFile, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Rename File via Context Menu", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should create and rename a file using context menu", async ({ page }) => {
    // Use utility function for file upload
    await uploadFile(page,  'test.txt', "course-drive");

    // Verify file appears in drive
    const file = page.locator("[data-drive-item]").filter({ hasText: "test.txt" });
    await expect(file).toBeVisible();

    // Right click on file to open context menu
    await file.click({ button: 'right' });

    // Click rename option
    await page.getByText("Rename").click();

    // Verify rename input appears and can be edited
    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput).toBeVisible();
    await page.waitForTimeout(300); // Wait for animation
    await renameInput.fill("renamed-file");

    await page.keyboard.press('Enter');

    // Verify file was renamed
    const renamedFile = page.locator("[data-drive-item]").filter({ hasText: "renamed-file.txt" });
    await expect(renamedFile).toBeVisible();
  });
}); 