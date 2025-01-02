import { test } from "@playwright/test";
import { testRequest } from "../helpers";
test.describe("Delete Folder via Context Menu", () => {
    test.beforeEach(async ({ page }) => {
        await testRequest(page);
    });
    test("Wait for timeout", async ({ page }) => {
        await page.waitForTimeout(5000);
    })
})

