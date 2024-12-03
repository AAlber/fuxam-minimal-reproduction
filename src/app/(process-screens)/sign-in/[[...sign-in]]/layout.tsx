import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fuxam | Sign In",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}