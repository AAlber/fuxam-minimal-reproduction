
import { Page, expect } from "@playwright/test";

// Helper functions from e2e.ts
export async function uploadFile(
  page: Page,
  // selector: string,
  fileName: string,
  driveType: "course-drive" | "user-drive",
) {
  const fileData = {
    name: fileName,
    mimeType: "application/json",
    buffer: Buffer.from('{"key": "value"}'),
  };

  await page.click(`[data-cy="${driveType}-upload-button"]`);
  // Handle file upload
  await page.locator(".uppy-Dashboard-input").first().setInputFiles([fileData]);

  await page.waitForResponse(
    (response) =>
      response
        .url()
        .includes(
          "https://fuxam-r2-bucket.d7cea93cb0b0fa7c6f98e336cecb5dec.r2.cloudflarestorage.com",
        ) && response.status() === 200,
  );
}

export async function testRequest(page: Page) {
  const response = await page.request.post('http://localhost:3000/api/test-request', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  if (!data.userId) {
    throw new Error("Test user not found");
  }
  return data;
}


export async function uploadFiles(
  page: Page,
  // selector: string,
  fileNames: string[],
  driveType: "course-drive" | "user-drive",
) {
  // Create a FileChooser for each file
  const files = fileNames.map((fileName) => {
    return {
      name: fileName,
      mimeType: "text/plain",
      buffer: Buffer.from("test content"),
    };
  });

  await page.click(`[data-cy="${driveType}-upload-button"]`);
  // Set up file drop

  await page.locator(".uppy-Dashboard-input").first().setInputFiles(files);

  // Wait for all file uploads to complete
  await Promise.all(
    Array(fileNames.length)
      .fill(null)
      .map(() => 
        page.waitForResponse(
          (response) =>
            response
              .url()
              .includes(
                "https://fuxam-r2-bucket.d7cea93cb0b0fa7c6f98e336cecb5dec.r2.cloudflarestorage.com",
              ) &&
            response.status() === 200 &&
            response.request().method() === "PUT",
      ),
      ),
  );
  // Wait for all uploaded files to appear in the drive
  for (const fileName of fileNames) {
    await page.locator("[data-drive-item]").filter({ hasText: fileName }).waitFor({
      state: "visible",
      timeout: 10000
    });
  }
}

export async function visitCourseDrivePage(page, layerId: string) {
  try {
    await page.goto(
      `/dashboard/course/${layerId}/learning-journey?user-drive=closed&search=&sidebar-view=drive`,
      { waitUntil: "networkidle" },
    );

    // Wait for drive to be visible
    await page.waitForSelector('[data-drive-instance="course-drive"]', {
      state: "visible",
      timeout: 30000,
    });
  } catch (error) {
    console.error("Failed to visit course drive page:", error);
    throw error;
  }
}

export async function createTestCourse(page) {
  await page.goto("/dashboard/structure");
  await page.waitForURL("/dashboard/structure", { timeout: 30000 });

  await page.click('[data-cy="create-course-button"]');
  await page.locator("form input").click();
  await page.locator("form input").type("test-course");
  await page.locator('form button[type="submit"]').click();

  await page.waitForTimeout(3000);
  await page.locator("ul li div").getByText("test-course").first().click();
  await page.waitForURL(/\/dashboard\/course\/.*\/learning-journey/);
}

/**
 * Helper function to select multiple elements while holding the platform-specific modifier key
 * @param page Playwright page object
 * @param selector Base selector for elements
 * @param items Array of text content to match elements
 */
export async function selectMultipleItems(
  page: Page,
  selector: string,
  items: string[],
) {
  if (items.length === 0) return;

  // Click first item normally
  await page.locator(selector, { hasText: items[0] }).click();

  if (items.length === 1) return;

  // Hold modifier key for subsequent selections
  const isMac = process.platform === "darwin";
  const modifierKey = isMac ? "Meta" : "Control";
  await page.keyboard.down(modifierKey);

  // Click remaining items
  for (let i = 1; i < items.length; i++) {
    await page.locator(selector, { hasText: items[i] }).click();
  }

  await page.keyboard.up(modifierKey);
}
