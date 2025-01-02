import { clerk, clerkSetup, setupClerkTestingToken } from "@clerk/testing/playwright";
import { FullConfig, test as setup } from "@playwright/test";
import path from "path";
import fs from 'fs/promises';
import { testRequest } from "./helpers";

const testDataFile = path.join(__dirname, '../playwright/.auth/test-data.json');
setup.describe.configure({ mode: "serial" });
setup("global setup", async () => {
  await clerkSetup();
});

const authFile = path.join(__dirname, "../playwright/.clerk/user.json");

setup("authenticate", async ({ page }) => {
  page.setDefaultTimeout(60000);
  await setupClerkTestingToken({page});
  await page.goto("/");
  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password",
      identifier:"fuxamtesting2@mailsac.com",
      password: "fuxamtesting2@mailsac.com",
    },
  });
  await page.goto("/");

  
  await page.context().storageState({ path: authFile });

  await testRequest(page);

  // const response = await page.request.post('http://localhost:3000/api/testing/create-trial-institution-and-add-user', {
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // });
  // const data = await response.json();
  
  // Store the layerId in a file
  // await fs.writeFile(testDataFile, JSON.stringify({ layerId: data.layerId }));
});