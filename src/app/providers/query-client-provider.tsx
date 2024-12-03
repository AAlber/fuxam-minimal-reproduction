"use client";

// https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#final-words
import {
  isServer,
  QueryClient,
  QueryClientProvider as Provider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
        gcTime: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
      // assign queryClient to window, so that it can be used anywhere, e.g. inside functions
      window.queryClient = browserQueryClient;
    }
    return browserQueryClient;
  }
}

export function QueryClientProvider(props: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <Provider client={queryClient}>
      {props.children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools buttonPosition="bottom-right" />
      )}
    </Provider>
  );
}

declare global {
  interface Window {
    queryClient: QueryClient;
  }
}
