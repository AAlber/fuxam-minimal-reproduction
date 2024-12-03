import type { PrismaClient } from "@prisma/client";
import type { DeepMockProxy } from "jest-mock-extended";
import { mockDeep, mockReset } from "jest-mock-extended";
import { prisma as originalPrisma } from "../src/app/misc/singletons/prisma";

jest.mock<typeof originalPrisma>(
  "../src/server/db/client",
  () =>
    ({
      __esModule: true,
      boostedPrisma: mockDeep<typeof originalPrisma>(),
      prisma: mockDeep<PrismaClient>(),
    }) as any,
);

beforeEach(() => {
  mockReset(prisma);
});

export const prisma = originalPrisma as unknown as DeepMockProxy<PrismaClient>;
