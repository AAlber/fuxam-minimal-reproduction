import { test } from '@/tests/fixtures';
import { uploadFile, visitCourseDrivePage } from '@/tests/helpers';
import { expect } from '@playwright/test';

test.describe('Download File via Context Menu', () => {
  test.beforeEach(async ({ page, layerId }) => {
    await visitCourseDrivePage(page, layerId);
  });

  test('should create and download a file using context menu', async ({ page, context }) => {
    // Create test file using utility function
    await uploadFile(page, 'test.txt', "course-drive");

    // Wait for upload to complete
    const uploadResponse = await page.waitForResponse(response => 
      response.url().includes(process.env.S3_API as string) && 
      response.request().method() === 'PUT'
    );
    expect(uploadResponse.status()).toBe(200);

    // Verify file appears in drive
    const fileElement = page.locator('[data-drive-item]', { hasText: 'test.txt' });
    await expect(fileElement).toBeVisible();

    // Set up download listener
    const downloadPromise = page.waitForEvent('download');

    // Right click on file to open context menu
    await fileElement.click({ button: 'right' });
    
    // Click download option
    await page.getByText('Download').click();

    // Wait for download to complete
    const download = await downloadPromise;
    
    // Verify download started
    expect(download.suggestedFilename()).toBe('test.txt');
  });
}); 