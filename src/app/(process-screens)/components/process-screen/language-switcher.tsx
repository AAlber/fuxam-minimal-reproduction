"use client";

import { Button } from "@/src/app/ui/button";

export default function LanguageSwitcher({
  className,
}: {
  className?: string;
}) {

  return (
    <>
      <Button
        size={"iconSm"}
        variant={"ghost"}
        onClick={() => console.log("change language")}
        className={className}
      >
        🇬🇧
      </Button>

      <Button
        size={"iconSm"}
        variant={"ghost"}
        onClick={() => console.log("change language")}
        className={className}
      >
        🇩🇪
      </Button>
    </>
  );
}
