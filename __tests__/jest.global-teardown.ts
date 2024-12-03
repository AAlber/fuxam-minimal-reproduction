/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { nukeTESTdb } from "./helpers/nukeTestDb";

export default async function cleanUp() {
  if (process.env.NODE_ENV === "test") {
    await nukeTESTdb();
  }
}
