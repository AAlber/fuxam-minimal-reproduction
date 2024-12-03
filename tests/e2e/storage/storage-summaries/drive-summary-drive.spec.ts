
import { test } from "@/tests/fixtures";
import { expect } from "@playwright/test";
import { visitCourseDrivePage } from "@/tests/helpers";

test.describe("Course Drive Storage Summary", () => {
  test.beforeEach(async ({ page, layerId }) => {
    // Assuming you have a custom method to visit the course drive page
    await visitCourseDrivePage(page, layerId);
  });

  test("should show correct folder sizes when adding files", async ({
    page,
  }) => {
    // Intercept PUT requests
    await page.route(`${process.env.S3_API}/**`, (route) => route.fulfill());

    // Create root level folders
    await page.click("[data-cy='course-drive-new-folder-button']", {
      force: true,
      timeout: 10000,
    });
    await page.fill("[data-cy='course-drive-rename-input']", "Folder 1");
    await page.press("[data-cy='course-drive-rename-input']", "Enter");

    await page.click("[data-cy='course-drive-new-folder-button']", {
      force: true,
      timeout: 10000,
    });
    await page.fill("[data-cy='course-drive-rename-input']", "Folder 2");
    await page.press("[data-cy='course-drive-rename-input']", "Enter");

    // Add files to Folder 1
    await page.dblclick("[data-drive-item]:has-text('Folder 1')");
    await dragAndDropFiles(page, '[data-drive-instance="course-drive"]', [
      "test1.txt",
      "test2.txt",
      "test3.txt",
    ]);

    // Create subfolder in Folder 1
    await page.click("[data-cy='course-drive-new-folder-button']");
    await page.fill("[data-cy='course-drive-rename-input']", "Subfolder 1");
    await page.press("[data-cy='course-drive-rename-input']", "Enter");

    await page.dblclick("[data-drive-item]:has-text('Subfolder 1')");

    await dragAndDropFiles(page, '[data-drive-instance="course-drive"]', [
      "subtest1.txt",
      "subtest2.txt",
    ]);

    // Return to root
    await page.click("[data-cy='course-drive-home-button']");

    // Expand Folder 1 by clicking folder icon
    await page.click('[data-cy="course-drive-folder-closed-icon-Folder 1"]');

    // Expand Subfolder 1 by clicking folder icon
    await page.click('[data-cy="course-drive-folder-closed-icon-Subfolder 1"]');

    // Verify Subfolder 1 size (2 files = 24 bytes)
    await expect(
      page.locator('[data-cy="drive-item-size-Subfolder 1"]'),
    ).toContainText("24 B");

    // Wait for upload progress to disappear
    await expect(
      page.locator('[data-cy="course-drive-upload-progress"]'),
    ).toBeHidden({ timeout: 30000 });

    // Verify Folder 1 size (3 direct files + 2 subfolder files = 60 bytes)
    await expect(
      page.locator('[data-cy="drive-item-size-Folder 1"]'),
    ).toContainText("60 B");
  });

  test("should show correct folder sizes when going to course settings", async ({
    page,
  }) => {
    await page.goto(`/dashboard/course/${process.env.LAYER_ID}/settings`);
    await expect(page).toHaveURL(
      `/dashboard/course/${process.env.LAYER_ID}/settings`,
    );
    //60B for the files + 15B for the 3 subfolders
    await expect(
      page.locator("[data-cy='course-storage-summary']"),
    ).toContainText("75 B");
  });
});

// Helper function to simulate drag and drop
async function dragAndDropFiles(page, selector: string, fileNames: string[]) {
  const dropZone = page.locator(selector);

  for (const fileName of fileNames) {
    await page.evaluate((fileName) => {
      const dataTransfer = new DataTransfer();
      const file = new File(["test content"], fileName, { type: "text/plain" });
      dataTransfer.items.add(file);

      const dropEvent = new DragEvent("drop", { dataTransfer });
      document
        .querySelector('[data-drive-instance="course-drive"]')
        ?.dispatchEvent(dropEvent);
    }, fileName);
  }

  await page.waitForTimeout(1000); // Wait for the drop to be processed
}
