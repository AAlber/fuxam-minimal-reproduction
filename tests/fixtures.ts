import { test as base } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';
// ... existing imports ...

type Fixtures = {
  layerId: string;
};
const testDataFile = path.join(__dirname, '../playwright/.auth/test-data.json');
export const test = base.extend<Fixtures>({
  // Make layerId a test-scoped fixture
  layerId: async ({}, use) => {
    const testData = JSON.parse(await fs.readFile(testDataFile, 'utf-8'));
    await use(testData.layerId);
  }
});


export { expect } from '@playwright/test';