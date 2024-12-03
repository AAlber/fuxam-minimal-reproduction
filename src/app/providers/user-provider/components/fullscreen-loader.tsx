"use client";

import Image from "next/image";
import * as React from "react";

export function FullscreenLoader() {
  const [storedTheme, setStoredTheme] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem("theme-storage");
      if (!item) return;
      const theme = JSON.parse(item);
      if (!theme) return;
      setStoredTheme(theme.state.instiTheme);
    }
  }, []);

  return (
    <div
      className={`theme- flex size-full flex-col items-center justify-center gap-4 bg-foreground ${storedTheme}`}
    >
      <Image src="/logo.svg" alt="logo loading" width={50} height={50} />
      <Image
        src="/ios-spinner.svg"
        alt="Spinner"
        width={22}
        height={22}
        className="opacity-50 dark:invert"
      />
    </div>
  );
}
