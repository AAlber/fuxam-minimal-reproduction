import { test, expect } from '@playwright/test';

test.describe('Click all pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/kv-cached/user-data*', route => route.fulfill({ status: 200 }));
    await page.route('/api/schedule/filter/get-custom-filter*', route => route.fulfill({ status: 200 }));
    await page.route('/api/schedule/get-all-upcoming-appointments*', route => route.fulfill({ status: 200 }));
    await page.route('/api/schedule/get-appointments-of-week/*', route => route.fulfill({ status: 200 }));
    await page.route('/api/administration/get-layer-tree/*', route => route.fulfill({ status: 200 }));
    await page.route('/api/role/get-users-of-institution*', route => route.fulfill({ status: 200 }));
    await page.route('/api/institution-settings/get-institution-settings*', route => route.fulfill({ status: 200 }));
    await page.route('/api/invite/count-pending-invites/*', route => route.fulfill({ status: 200 }));
    await page.route('/api/role/get-admins-of-institution*', route => route.fulfill({ status: 200 }));
  });

  test('Click all pages', async ({ page }) => {
    // Navigate to chat page
    await test.step('Navigate to chat page', async () => {
      await page.click('ul.flex > .flex-col > :nth-child(2) > .relative');
      await page.waitForTimeout(3000);
    });

    // Navigate to calendar page
    await test.step('Navigate to calendar page', async () => {
      await page.click(':nth-child(4) > .relative');
      await expect(async () => {
        const response = await page.request.get('/api/schedule/filter/get-custom-filter*');
        expect(response.status()).toBe(200);
      }).toPass();
      await expect(async () => {
        const response = await page.request.get('/api/schedule/get-all-upcoming-appointments*');
        expect(response.status()).toBe(200);
      }).toPass();
      await expect(async () => {
        const response = await page.request.get('/api/schedule/get-appointments-of-week/*');
        expect(response.status()).toBe(200);
      }).toPass();
    });

    // Navigate to structure page
    await test.step('Navigate to structure page', async () => {
      await page.click(':nth-child(5) > .relative');
      await expect(async () => {
        const response = await page.request.get('/api/administration/get-layer-tree/*');
        expect(response.status()).toBe(200);
      }).toPass();
    });

    // Navigate to user management page
    await test.step('Navigate to user management page', async () => {
      await page.click(':nth-child(6) > .relative');
      await expect(async () => {
        const response = await page.request.get('/api/role/get-users-of-institution*');
        expect(response.status()).toBe(200);
      }).toPass();
    });

    // Navigate to settings page
    await test.step('Navigate to settings page', async () => {
      await page.click(':nth-child(7) > .relative');
      await expect(async () => {
        const response = await page.request.get('/api/institution-settings/get-institution-settings*');
        expect(response.status()).toBe(200);
      }).toPass();
    });
  });
});
