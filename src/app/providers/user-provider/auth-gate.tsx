import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { unstable_noStore } from "next/cache";
import React from "react";

export async function AuthGate({ children }: React.PropsWithChildren) {
  unstable_noStore();
  const { userId } = auth();
  console.log(userId);
  return (
    <>
      {children}
    </>
  );
}
