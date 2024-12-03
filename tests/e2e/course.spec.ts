import { test, expect } from '@playwright/test';

test.describe('Course', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/kv-cached/get-course-content-blocks*', route => route.fulfill());
    await page.route('**/api/cloudflare/list-files-in-directory*', route => route.fulfill());
    await page.route('**/api/courses/get-content-block-user-status*', route => route.fulfill());
    await page.route('**/api/peer-feedback/get-all-for-layer/*', route => route.fulfill());
    await page.route('**/api/courses/get-all-course-members', route => route.fulfill());
    await page.route('**/api/users/get-by-layer/*', route => route.fulfill());
    await page.route('**/api/course-goals/*', route => route.fulfill());
    await page.route('**/api/ai/ai-tool-button-completion', route => route.fulfill());
    await page.route('**/api/content-block/create', route => route.fulfill());
    await page.route('**/api/content-block/delete', route => route.fulfill());
    await page.route('**/api/schedule/get-possible-attendees*', route => route.fulfill());
    await page.route('**/api/schedule/get-users-and-availability*', route => route.fulfill());
    await page.route('**/api/schedule/create-appointment', route => route.fulfill());
  });

  test.describe('Course Chat', () => {
    test('Message', async ({ page }) => {
      await page.getByText(/^Chat$/).click();
      await page.locator('.overflow-y-scroll > p').type('Test');
      await page.locator('.hidden > .w-full > .inline-flex').click();
    });

    test('Gif', async ({ page }) => {
      await page.locator('.grow > .inline-flex').click();
      await page.locator(':nth-child(8) > .flex').click();
      await page.waitForTimeout(6000);
      await page.locator('.grid > :nth-child(1) > .size-full').click();
      await page.waitForTimeout(2000);
    });
  });

  test.describe('Splitscreen', () => {
    test('navigate to info', async ({ page }) => {
      // Placeholder for info navigation test
    });

    test('navigate to Chat', async ({ page }) => {
      await page.getByText(/^Chat$/).click();
    });

    test('navigate to drive', async ({ page }) => {
      await page.getByText(/^(Drive|Dateien)$/).click();
      const response = await page.waitForResponse('**/api/cloudflare/list-files-in-directory*');
      expect(response.status()).toBe(200);
    });

    test('Close the Splitscreen', async ({ page }) => {
      await page.locator('.space-x-2 > .hover\\:text-muted-contrast').click();
      await page.waitForTimeout(1000);
      await page.locator('.space-x-2 > .hover\\:text-muted-contrast').click();
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Course Icon & Banner', () => {
    test('Course Icon', async ({ page }) => {
      await page.locator('.inline-flex > .size-28').click();
      await page.getByText('Emoji').click();
      await page.getByRole('button', { name: '😊' }).click();
      await page.getByRole('button', { name: '😎' }).click();
    });
  });

  test.describe('Course Tabs', () => {
    test('Course User', async ({ page }) => {
      await page.locator('.w-auto > :nth-child(2)').click();
      const response = await page.waitForResponse('**/api/users/get-by-layer/*');
      expect(response.status()).toBe(200);
    });

    test('Course Settings', async ({ page }) => {
      await page.locator('.w-auto > :nth-child(3)').click();
      const response = await page.waitForResponse('**/api/course-goals/*');
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Course Content Block', () => {
    test('Create Hand-in and Use AI Wand', async ({ page }) => {
      await page.getByText(/^(Learning Journey|Lernreise)$/).click();
      await page.getByText(/^(Create|Erstellen)$/).click();
      await page.getByText(/(Deliverables|Abgaben)/).click();
      await page.getByText(/(Hand-in|Datei Abgabe)/).click();
      await page.locator('#title').click();
      await page.locator('#title').type('Test');
      await page.locator('div.grid > :nth-child(4) > div.relative > .flex').click();
      await page.locator('div.grid > :nth-child(4) > div.relative > .flex').type('little gramar mistake');
      await page.locator('form > .inline-flex').click();
      const aiResponse = await page.waitForResponse('**/api/ai/ai-tool-button-completion');
      expect(aiResponse.status()).toBe(200);
      await page.getByText(/^(Publish|Erstellen)$/).click();
      const createResponse = await page.waitForResponse('**/api/content-block/create');
      expect(createResponse.status()).toBe(200);
      const journeyResponse = await page.waitForResponse('**/api/courses/get-content-block-user-status*');
      expect(journeyResponse.status()).toBe(200);
    });

    test('Create a Section', async ({ page }) => {
      await page.getByText(/^(Learning Journey|Lernreise)$/).click();
      await page.getByText(/^(Create|Erstellen)$/).click();
      await page.getByText(/(Section|Abschnitt)/).click();
      await page.locator('#title').click();
      await page.locator('#title').type('My Section');
      await page.getByText(/^(Publish|Erstellen)$/).click();
      const createResponse = await page.waitForResponse('**/api/content-block/create');
      expect(createResponse.status()).toBe(200);
      const journeyResponse = await page.waitForResponse('**/api/courses/get-content-block-user-status*');
      expect(journeyResponse.status()).toBe(200);
    });

    test('Toggle Table top view', async ({ page }) => {
      await page.locator('[id*="headlessui-switch-"]').click();
      await page.waitForTimeout(1000);
      await page.locator('[id*="headlessui-switch-"]').click();
    });

    test('Delete Block', async ({ page }) => {
      await page.locator('[id*="headlessui-switch-"]').click();
      await page.locator('div[id*="radix-"] > .inline-flex').first().click();
      await page.locator('[data-testid="button-option-block-delete"]').click();
      await page.locator('.bg-destructive').click();
      const deleteResponse = await page.waitForResponse('**/api/content-block/delete');
      expect(deleteResponse.status()).toBe(200);
    });

    test('Course event', async ({ page }) => {
      await page.getByText(/^(Schedule|Zeitplan)$/).click();
      await page.locator('.relative > .gap-2 > .inline-flex').click();
      const attendeesResponse = await page.waitForResponse('**/api/schedule/get-possible-attendees*');
      expect(attendeesResponse.status()).toBe(200);
      const availabilityResponse = await page.waitForResponse('**/api/schedule/get-users-and-availability*');
      expect(availabilityResponse.status()).toBe(200);
      await page.locator(':nth-child(2) > .relative > #title').click();
      await page.locator(':nth-child(2) > .relative > #title').type('Test Event #1');
      await page.locator('.mt-4 > .bg-primary').click();
      const appointmentResponse = await page.waitForResponse('**/api/schedule/create-appointment');
      expect(appointmentResponse.status()).toBe(200);
      const infoResponse = await page.waitForResponse('**/api/kv-cached/get-course-content-blocks*');
      expect(infoResponse.status()).toBe(200);
    });

    test('Course event by clicking the + icon', async ({ page }) => {
      await page.locator('.mt-2 > .inline-flex').click();
      const attendeesResponse = await page.waitForResponse('**/api/schedule/get-possible-attendees*');
      expect(attendeesResponse.status()).toBe(200);
      const availabilityResponse = await page.waitForResponse('**/api/schedule/get-users-and-availability*');
      expect(availabilityResponse.status()).toBe(200);
      await page.locator(':nth-child(2) > .relative > #title').click();
      await page.locator(':nth-child(2) > .relative > #title').type('Test Event #2');
      await page.locator('.mt-4 > .bg-primary').click();
      const appointmentResponse = await page.waitForResponse('**/api/schedule/create-appointment');
      expect(appointmentResponse.status()).toBe(200);
      const infoResponse = await page.waitForResponse('**/api/kv-cached/get-course-content-blocks*');
      expect(infoResponse.status()).toBe(200);
    });
  });
});
