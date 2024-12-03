import { clerkSetup } from "@clerk/testing/cypress";
import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "j1vep7",
  screenshotOnRunFailure: !process.env.CYPRESS_BASE_URL, // do not take screenShots when running on github
  e2e: {
    viewportWidth: 1920,
    viewportHeight: 1080,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    numTestsKeptInMemory: 10,
    requestTimeout: 30000,
    defaultCommandTimeout: 30000,
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    setupNodeEvents(on, config) {
      return clerkSetup({ config });
    },
    testIsolation: true,
    experimentalMemoryManagement: true,
    //numTestsKeptInMemory: 10,
  },
  env: {
    s3_api: "https://fuxam-r2-bucket.d7cea93cb0b0fa7c6f98e336cecb5dec.r2.cloudflarestorage.com",
    test_email:
      process.env.SERVER_URL !== "http://localhost:3000"
        ? "githubcypressfuxam@mailsac.com"
        : "fuxamtesting2@mailsac.com",
    test_password:
      process.env.SERVER_URL !== "http://localhost:3000"
        ? "123GitHub567"
        : "fuxamtesting2@mailsac.com",
    includeShadowDom: false,
  },
});
