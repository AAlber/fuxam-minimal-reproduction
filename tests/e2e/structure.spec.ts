import { test, expect } from '@playwright/test';

test.describe('Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/administration/rename-layer', route => route.fulfill());
    await page.route('**/api/layer/create-layer', route => route.fulfill());
    await page.route('**/api/layer/get-course-tree', route => route.fulfill());
    
    // Note: You'll need to implement a proper sign-in method for Playwright
    // This is a placeholder and should be replaced with your actual sign-in logic
    await page.goto('/signin');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
  });

  test('should create and manage course structure', async ({ page }) => {
    // Create Layer
    await page.click('ul.flex > .flex-col > :nth-child(4) > .relative');
    await page.waitForResponse('**/api/layer/get-course-tree');
    await page.click('text=/Layer|Ebene/');
    await page.click('.gap-2 > .flex >> nth=0');
    await page.fill('.gap-2 > .flex >> nth=0', 'Test Layer');
    await page.click('.gap-2 > .inline-flex');
    await page.waitForResponse('**/api/layer/create-layer');

    // Create Course
    await page.click('text=/Course|Kurs/');
    await page.click('.gap-2 > .flex >> nth=0');
    await page.fill('.gap-2 > .flex >> nth=0', 'Mathe');
    await page.click('.gap-2 > .inline-flex');
    await page.waitForResponse('**/api/layer/create-layer');

    // Add Course
    await page.click('text="Test Layer" >> xpath=../div/button[contains(@id, "radix")]');
    await page.click('text=/Add Course|Kurs hinzufügen/');
    await page.fill('#rename-modal-input', 'Informatik');
    await page.click('text=/^(Create|Erstellen)$/');
    await page.waitForResponse('**/api/layer/create-layer');

    // Add Sublayer
    await page.click('text="Test Layer" >> xpath=../div/button[contains(@id, "radix")]');
    await page.click('text=/Add Sublayer|Unter Ebene hinzufügen/');
    await page.fill('#rename-modal-input', 'Sublayer');
    await page.click('text=/^(Create|Erstellen)$/');
    await page.waitForResponse('**/api/layer/create-layer');

    // Rename Course
    await page.click('text="Mathe" >> xpath=../div/button[contains(@id, "radix")]');
    await page.click('text=/Settings|Einstellungen/');
    await page.fill(':nth-child(2) > :nth-child(1) > .relative > #title', 'Renamed-Course');
    await page.click('text=/^(Save|Speichern)$/');
    await page.waitForResponse('**/api/administration/rename-layer');

    // Set Display Name
    await page.click('text="Renamed-Course" >> xpath=../div/button[contains(@id, "radix")]');
    await page.click('text=/Settings|Einstellungen/');
    await page.fill(':nth-child(4) > :nth-child(1) > .relative > #title', 'Mathematik');
    await page.click('text=/^(Save|Speichern)$/');
    await page.waitForResponse('**/api/administration/rename-layer');

    // Mirror Course
    await page.click('text="Renamed-Course" >> xpath=../div/button[contains(@id, "radix")]');
    await page.click('text=/Mirror Course|Kurs spiegeln/');
  });
});
