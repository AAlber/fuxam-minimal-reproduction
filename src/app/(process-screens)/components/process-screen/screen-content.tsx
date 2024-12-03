import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const LanguageSwitcher = dynamic(() => import("./language-switcher"), {
  ssr: false,
});
const PrivacyLogoSection = dynamic(() => import("./privacy-logo-section"), {
  ssr: false,
});

export const Content = ({ children }: { children: ReactNode }) => {
  return (
    <div className="absolute right-0 z-50 flex min-h-screen w-full min-w-[400px] flex-col items-center justify-center border border-white bg-clip-padding shadow-2xl backdrop-blur-3xl md:w-1/2">
      <div className="flex w-3/5 flex-col items-center justify-center">
        {children}
      </div>
      <PrivacyLogoSection />
      <div className="absolute bottom-8 right-8 flex items-center gap-2">
        <LanguageSwitcher className="text-xl" />
      </div>
    </div>
  );
};
