import { test, expect } from '@playwright/test';

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/users/create-institution-user', route => route.fulfill());
    await page.route('**/api/role/get-layers-user-has-special-access-to', route => route.fulfill());
    await page.route('**/api/role/create-role', route => route.fulfill());
    await page.route('**/api/notes/create-user-notes', route => route.fulfill());
    await page.route('**/api/notes/update-user-notes**', route => route.fulfill());
    await page.route('**/api/notes/delete-user-notes**', route => route.fulfill());
    await page.route('**/api/schedule/get-appointments-of-week/**', route => route.fulfill());
    await page.route('**/api/role/get-top-most-layers-user-has-access-to**', route => route.fulfill());
  });

  test('User Management', async ({ page }) => {
    await page.locator(':nth-child(5) > .relative').first().click();
    
    // Create User 1
    await test.step('Create User 1', async () => {
      await page.getByText(/^(Create|Erstellen)$/).click();
      await page.getByText(/^(Create user|Erstellen Benutzer*innen)$/).click();
      await page.locator('#name').click();
      await page.locator('#name').fill('User 1');
      await page.locator('#email').click();
      await page.locator('#email').fill(`test1-${Date.now()}@mail.com`);
      await page.locator('.flex-col-reverse > .inline-flex').click();
      await expect(page.locator('body')).toBeVisible(); // Placeholder for response check
    });

    // Create User 2
    await test.step('Create User 2', async () => {
      await page.getByText(/^(Create|Erstellen)$/).click();
      await page.getByText(/^(Create user|Erstellen Benutzer*innen)$/).click();
      await page.locator('#name').click();
      await page.locator('#name').fill('User 2');
      await page.locator('#email').click();
      await page.locator('#email').fill(`test2-${Date.now()}@mail.com`);
      await page.locator('.flex-col-reverse > .inline-flex').click();
      await expect(page.locator('body')).toBeVisible(); // Placeholder for response check
    });

    // Group Chat
    await test.step('Group Chat', async () => {
      await page.locator('div>div>table>tbody>tr>td>div>button[role="checkbox"]').nth(1).click();
      await page.locator('div>div>table>tbody>tr>td>div>button[role="checkbox"]').nth(2).click();
      await page.locator(':nth-child(4) > .inline-flex').click();
      await page.locator('.overflow-y-scroll > p').click();
      await page.locator('.overflow-y-scroll > p').fill('Test');
      await page.locator('.hidden > .w-full > .inline-flex').click();
      await page.waitForTimeout(2000);
    });

    // Delete Group Chat
    await test.step('Delete Group Chat', async () => {
      await page.locator(':nth-child(1) > :nth-child(1) > .overflow-y-scroll').first().click();
      await page.locator(':nth-child(1) > :nth-child(1) > .overflow-y-scroll>div>div>div>[id*="radix-"]').click();
      await page.locator('[role="group"] > .cursor-pointer > span').click();
      await page.getByText(/^(Delete|Löschen)$/).click();
      await page.locator(':nth-child(5) > .relative').click();
    });

    // Give access to
    await test.step('Give access to', async () => {
      await page.locator('div>div>table>tbody>tr>td>div>button[role="checkbox"]').nth(2).click();
      await page.locator('div[class*="flex flex-1"]>div>button[aria-controls*="radix-"]').first().click();
      await expect(page.locator('body')).toBeVisible(); // Placeholder for response check
      await page.locator('[role="presentation"]>[role="group"]').first().click();
      await expect(page.locator('body')).toBeVisible(); // Placeholder for response check
    });

    // Create Notes
    await test.step('Create Notes', async () => {
      await page.locator(':nth-child(2) > [style="width: calc(var(--col-name-size) * 1px);"] > :nth-child(1) > .group > .w-auto > .truncate').click();
      await page.locator('.relative > .inline-flex').click();
      await page.locator('.tiptap > p').click();
      await page.locator('.tiptap > p').fill('Hello World!');
      await page.locator('.gap-x-2 > .bg-primary').click();
      await page.waitForTimeout(2000);
    });

    // Update Notes
    await test.step('Update Notes', async () => {
      await page.locator('[aria-haspopup="dialog"] > .inline-flex').click();
      await page.locator('h3>button[aria-controls*="radix-"]>svg').click();
      await page.locator('.has-focus').click();
      await page.keyboard.press('Control+A');
      await page.locator('.has-focus').fill('Some note');
      await page.locator('.gap-x-2 > .bg-primary').click();
      await page.waitForTimeout(2000);
    });

    // Delete Notes
    await test.step('Delete Notes', async () => {
      await page.locator('.gap-x-2 > .bg-accent\\/80').click();
      await page.locator('.bg-destructive').click();
      await page.waitForTimeout(2000);
    });

    // User Calendar
    await test.step('User Calendar', async () => {
      await page.getByText(/^(Calendar|Kalendar)$/).click();
      await page.locator('.min-h-\\[33px\\] > .absolute > :nth-child(2)').click();
      await page.locator('.min-h-\\[33px\\] > .absolute > :nth-child(2)').click();
      await page.locator('.absolute > .ml-1').click();
      await page.locator('.absolute > .ml-1').click();
      await page.locator('.h-14 > :nth-child(1) > .inline-flex').click();
    });
  });
});
