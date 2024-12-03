import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import "../../styles/globals.css";
import { AuthGate } from "./providers/user-provider/auth-gate";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const SpeedInsights = dynamic(() =>
  import("@vercel/speed-insights/next").then((mod) => mod.SpeedInsights),
);

const Analytics = dynamic(() =>
  import("@vercel/analytics/react").then((mod) => mod.Analytics),
);

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <html className={inter.className}>
      <SpeedInsights />
      <Analytics />
      <AuthGate>{children}</AuthGate>
    </html>
  );
}
