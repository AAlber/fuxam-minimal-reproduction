/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import type { UserWithRoleInstitutionAndLayersDataType } from ".";

export type MockLayer =
  UserWithRoleInstitutionAndLayersDataType["layers"][number];

export type MockOrganization =
  UserWithRoleInstitutionAndLayersDataType["institution"];
