import { ClerkProvider } from "@clerk/nextjs";
import { unstable_noStore } from "next/cache";
import React from "react";

export async function AuthGate({ children }: React.PropsWithChildren) {
  unstable_noStore();

  return (
    <>
      <ClerkProvider>
        {children}
      </ClerkProvider>
    </>
  );
}
