import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fuxam | Sign Up",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}