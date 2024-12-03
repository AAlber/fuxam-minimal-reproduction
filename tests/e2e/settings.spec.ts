import { test, expect } from '@playwright/test';

test.describe('Click through settings page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/institution-settings/get-institution-settings', route => route.fulfill({ status: 200 }));
    await page.route('**/api/role/get-admins-of-institution', route => route.fulfill({ status: 200 }));
    await page.route('**/api/rating-schema/get-rating-schemas*', route => route.fulfill({ status: 200 }));
    await page.route('**/api/institution-user-group/user-groups-of-institution*', route => route.fulfill({ status: 200 }));
    await page.route('**/api/institution-user-data-field/get-institution-user-data-fields*', route => route.fulfill({ status: 200 }));
    await page.route('**/api/institution-settings/get-institution-storage-status*', route => route.fulfill({ status: 200 }));
    await page.route('**/api/institution-settings/get-institution-settings*', route => route.fulfill({ status: 200 }));
    await page.route('**/api/ai/budget/get-report', route => route.fulfill({ status: 200 }));
    await page.route('**/api/administration/get-deleted-layers', route => route.fulfill({ status: 200 }));
    await page.route('**/api/stripe/get-customer-and-tax-id*', route => route.fulfill({ status: 200 }));
    await page.route('**/api/stripe/get-invoices*', route => route.fulfill({ status: 200 }));
    await page.route('**/api/stripe/get-payment-methods*', route => route.fulfill({ status: 200 }));
    await page.route('**/api/stripe/paid-access-passes/get-account*', route => route.fulfill({ status: 200 }));
    await page.route('**/api/stripe/access-passes/get-access-pass-status-infos*', route => route.fulfill({ status: 200 }));
  });

  test('General Page', async ({ page }) => {
    await page.locator(':nth-child(6) > .relative').click(); // settings
    await expect(page.locator('body')).toBeVisible();
  });

  test('Roles & Permissions Page', async ({ page }) => {
    await page.locator('#cards > :nth-child(2) > .flex').click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('LMS Page', async ({ page }) => {
    await page.locator('#cards > :nth-child(3) > .flex').click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('User Management Page', async ({ page }) => {
    await page.locator('#cards > :nth-child(4) > .flex').click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('Communication Page', async ({ page }) => {
    await page.locator('#cards > :nth-child(5) > .flex').click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('Addons & Integrations Page', async ({ page }) => {
    await page.locator('#cards > :nth-child(6) > .flex').click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('Schedule Page', async ({ page }) => {
    await page.locator('#cards > :nth-child(8) > .flex').click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('Video Calls Page', async ({ page }) => {
    await page.locator(':nth-child(9) > .flex').click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('Room management Page', async ({ page }) => {
    await page.locator(':nth-child(10) > .flex').click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('Storage Page', async ({ page }) => {
    await page.locator(':nth-child(11) > .flex').click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('Ai Page', async ({ page }) => {
    await page.locator(':nth-child(12) > .flex').click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('Data & Privacy Page', async ({ page }) => {
    await page.locator(':nth-child(13) > .flex').click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('Billing Page', async ({ page }) => {
    await page.locator(':nth-child(15) > .flex').click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('Access Pass Page', async ({ page }) => {
    await page.locator(':nth-child(16) > .flex').click();
    await expect(page.locator('body')).toBeVisible();
  });
});
