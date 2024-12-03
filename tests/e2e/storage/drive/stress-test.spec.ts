import { test } from '@/tests/fixtures';
import { uploadFiles, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe("Course Sidebar Drive", () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test("should display empty drive state when no files exist", async ({ page }) => {
    const driveInstance = page.locator('[data-drive-instance="course-drive"]');
    await expect(driveInstance).toBeVisible();
    await expect(driveInstance.locator(".lucide-file-x")).toBeVisible();
    await expect(driveInstance.getByText("No files found")).toBeVisible();
  });

  test("should show home button navigation", async ({ page }) => {
    const homeButton = page.locator("[data-cy='course-drive-home-button']");
    await expect(homeButton).toBeVisible();
    await expect(homeButton).toHaveCSS("cursor", "pointer");
    await homeButton.hover();
    await expect(homeButton).toHaveCSS("cursor", "pointer");
  });

  test("should create new folder and show in breadcrumb", async ({ page }) => {
    await page.locator("[data-cy='course-drive-new-folder-button']").click({ force: true, timeout: 10000 });
    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput).toBeVisible();
    await expect(renameInput).toBeFocused();
    await renameInput.fill("Test Folder");
    await page.keyboard.press("Enter");

    await expect(page.locator("[data-drive-item]").getByText("Test Folder")).toBeVisible();
    await page.locator("[data-drive-item]").getByText("Test Folder").dblclick();

    const breadcrumb = page.locator('[data-cy="course-drive-breadcrumb-Test Folder"]');
    await expect(breadcrumb).toBeVisible();
    await breadcrumb.click();

    await expect(page.locator("[data-drive-item]")).not.toBeVisible();
  });

  test("should drag and drop file into folder", async ({ page }) => {
    await page.locator("[data-cy='course-drive-home-button']").click();
    const driveInstance = page.locator('[data-drive-instance="course-drive"]');

    await uploadFiles(page, ['test.txt'], "course-drive");

    await expect(driveInstance.locator("[data-drive-item]").getByText("test.txt")).toBeVisible();
    await expect(driveInstance.locator("[data-drive-item]")).toHaveCount(2);
  });

  test("should allow sorting by name", async ({ page }) => {
    const sortButton = page.locator('[data-cy="course-drive-sort-button-name"]');
    await sortButton.click();
    await expect(sortButton).toBeVisible();
    await expect(page.locator("[data-drive-item]").first()).toContainText("Test Folder");
    await sortButton.click();
    await expect(sortButton).toBeVisible();
    await expect(page.locator("[data-drive-item]").first()).toContainText("test.txt");
  });

  test("should allow sorting by type", async ({ page }) => {
    const sortButton = page.locator('[data-cy="course-drive-sort-button-type"]');
    await sortButton.click();
    await expect(sortButton).toBeVisible();
    await expect(page.locator("[data-drive-item]").first()).toContainText("Test Folder");
    await sortButton.click();
    await expect(sortButton).toBeVisible();
    await expect(page.locator("[data-drive-item]").first()).toContainText("test.txt");
  });

  test("should allow sorting by last modified", async ({ page }) => {
    const sortButton = page.locator('[data-cy="course-drive-sort-button-lastModified"]');
    await sortButton.click();
    await expect(sortButton).toBeVisible();
    await sortButton.click();
    await expect(sortButton).toBeVisible();
  });

  test("should allow sorting by size", async ({ page }) => {
    const sortButton = page.locator('[data-cy="course-drive-sort-button-size"]');
    await sortButton.click();
    await expect(sortButton).toBeVisible();
    await expect(page.locator("[data-drive-item]").first()).toContainText("Test Folder");
    await sortButton.click();
    await expect(sortButton).toBeVisible();
    await expect(page.locator("[data-drive-item]").first()).toContainText("test.txt");
  });

  test("should allow file search", async ({ page }) => {
    const searchInput = page.locator('[data-cy="course-drive-search"] input');
    await searchInput.click();
    await searchInput.type("test");

    await expect(page.locator("[data-drive-item]")).toHaveCount(2);

    await searchInput.type(".txt");
    await expect(page.locator("[data-drive-item]")).toHaveCount(1);
    await expect(page.locator("[data-drive-item]").getByText("test.txt")).toBeVisible();
  });

  test("should show folder context menu with correct data-cy attributes", async ({ page }) => {
    await page.locator('[data-cy="course-drive-search"] input').clear();

    await page.locator("[data-drive-item]").getByText("Test Folder").click({ button: 'right' });

    const contextMenu = page.locator("[data-radix-menu-content]");
    await expect(contextMenu).toBeVisible();
    await expect(contextMenu.locator('[data-cy="course-drive-new-subfolder-button"]')).toBeVisible();
    await expect(contextMenu.locator('[data-cy="course-drive-open-button"]')).toBeVisible();
    await expect(contextMenu.locator('[data-cy="course-drive-rename-button"]')).toBeVisible();
    await expect(contextMenu.locator('[data-cy="course-drive-unlock-button"]')).toBeVisible();

    await page.locator("[data-drive-item]").getByText("Test Folder").click({ force: true });
  });

  test("should show file context menu with correct data-cy attributes", async ({ page }) => {
    await page.locator("[data-drive-item]").getByText("test.txt").click({ button: 'right' });

    const contextMenu = page.locator("[data-radix-menu-content]");
    await expect(contextMenu).toBeVisible();
    await expect(contextMenu.locator('[data-cy="course-drive-download-button"]')).toBeVisible();
    await expect(contextMenu.locator('[data-cy="course-drive-rename-button"]')).toBeVisible();

    await page.locator("[data-drive-item]").getByText("Test Folder").click({ force: true });
  });

  test("should allow drag and drop of files into folders", async ({ page }) => {
    const dataTransfer = await page.evaluateHandle(() => {
      const dt = new DataTransfer();
      const file = new File(["test content"], "dragtest.txt", { type: "text/plain" });
      dt.items.add(file);
      return dt;
    });

    const dropTarget = page.locator("[data-drive-item]").getByText("Test Folder");

    await dropTarget.dispatchEvent('dragenter', { dataTransfer });
    await dropTarget.dispatchEvent('dragover', { dataTransfer });
    await dropTarget.dispatchEvent('drop', { dataTransfer });

    await page.locator('[data-cy="course-drive-folder-closed-icon-Test Folder"]').click();

    await expect(page.locator("[data-drive-item]").getByText("dragtest.txt")).toBeVisible();
  });

  test("should expand folder when clicking folder icon", async ({ page }) => {
    await page.locator('[data-cy="course-drive-folder-open-icon-Test Folder"]').click();

    await expect(page.locator('[data-cy="course-drive-folder-closed-icon-Test Folder"]')).toBeVisible();

    await expect(page.locator("[data-drive-item]").getByText("dragtest.txt")).not.toBeVisible();
  });

  test('should handle context menu download action', async ({ page }) => {
    await page.route(`${process.env.S3_API}/**`, route => route.fulfill({ status: 200 }));

    await page.locator("[data-drive-item]").getByText("test.txt").click({ button: 'right' });
    await page.getByText('Download').click();

    const downloadRequest = await page.waitForRequest(`${process.env.S3_API}/**`);
    expect(downloadRequest.url()).toContain(process.env.S3_API);
  });

  test("should download file on double click", async ({ page }) => {
    await page.route(`${process.env.S3_API}/**`, route => route.fulfill({ status: 200 }));

    await page.locator("[data-drive-item]").getByText("test.txt").dblclick();

    const downloadRequest = await page.waitForRequest(`${process.env.S3_API}/**`);
    expect(downloadRequest.url()).toContain(process.env.S3_API);
  });

  test('should handle context menu delete action', async ({ page }) => {
    await page.locator("[data-drive-item]").getByText("Test Folder").click({ button: 'right' });
    await page.getByText('Delete').click();

    const confirmationCode = await page.locator('[data-cy="confirmation-code-text"]').textContent();
    await page.locator('[data-input-otp="true"]').fill(confirmationCode ?? '');

    await page.locator('[data-cy="confirmation-dialog-confirm-button"]').click();

    await expect(page.locator("[data-drive-item]").getByText("Test Folder")).not.toBeVisible();
    await expect(page.locator("[data-drive-item]").getByText("dragtest.txt")).not.toBeVisible();
  });

  test('should handle context menu rename action', async ({ page }) => {
    await page.locator("[data-drive-item]").getByText("test.txt").click({ button: 'right' });
    await page.getByText('Rename').click();

    const renameInput = page.locator("[data-cy='course-drive-rename-input']");
    await expect(renameInput).toBeVisible();
    await page.waitForTimeout(300);
    await renameInput.type('renamed-file');
    await page.keyboard.press('Enter');

    await expect(page.locator("[data-drive-item]").getByText("renamed-file.txt")).toBeVisible();
  });

  test('should handle file upload and folder navigation', async ({ page }) => {
    await page.locator('[data-cy="course-drive-upload-button"]').click();

    await page.setInputFiles('[data-cy="course-drive-upload-input"]', 'path/to/example.json');

    await page.route(`${process.env.S3_API}/**`, route => route.fulfill({ status: 200 }));
    await page.waitForRequest(`${process.env.S3_API}/**`);

    await page.locator('[data-cy="new-folder-button"]').click();
    await page.locator('[data-cy="new-folder-input"]').type('New Test Folder');
    await page.keyboard.press('Enter');

    await page.locator('[data-drive-item]').getByText('New Test Folder').dblclick();

    await page.locator('[data-cy="course-drive-upload-button"]').click();
    await page.setInputFiles('[data-cy="course-drive-upload-input"]', 'path/to/test.txt');

    await page.waitForRequest(`${process.env.S3_API}/**`);

    await expect(page.locator('[data-drive-item]').getByText('test.txt')).toBeVisible();

    await page.locator('[data-cy="new-folder-button"]').click();
    await page.locator('[data-cy="new-folder-input"]').type('Nested Test Folder');
    await page.keyboard.press('Enter');

    await page.locator('[data-drive-item]').getByText('Nested Test Folder').dblclick();

    await page.locator('[data-cy="course-drive-upload-button"]').click();
    await page.setInputFiles('[data-cy="course-drive-upload-input"]', 'path/to/nested-test.txt');

    await page.waitForRequest(`${process.env.S3_API}/**`);

    await expect(page.locator('[data-drive-item]').getByText('nested-test.txt')).toBeVisible();
  });
});
