import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { unstable_noStore } from "next/cache";
import React, { Suspense } from "react";
import { FullscreenLoader } from "./components/fullscreen-loader";

export async function AuthGate({ children }: React.PropsWithChildren) {
  unstable_noStore();
  const { userId } = auth();

  return (
    <>
      <ClerkProvider>
        {userId ? (
          <Suspense fallback={<FullscreenLoader />}>
            {children}
          </Suspense>
        ) : (
          children
        )}
      </ClerkProvider>
    </>
  );
}
