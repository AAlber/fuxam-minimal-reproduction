"use client";

import { Button } from "@/src/app/ui/button";
import Image from "next/image";

export default function PrivacyLogoSection() {

  return (
    <>
      <footer className="absolute bottom-8 flex flex-col items-center justify-center gap-2">
        <Image
          className="relative right-4"
          src="/logo-txt-black.svg"
          width={80}
          height={80}
          alt="Fuxam"
        />
        <div className="flex items-center justify-center gap-2">
          <Button
            variant={"link"}
            className="!text-xs !text-muted-contrast"
            onClick={() => window.open("Privacy")}
          >
            {"Privacy"}
          </Button>
          <div className="h-5 w-px bg-muted-contrast"></div>
          <Button
            variant={"link"}
            className="!text-xs !text-muted-contrast"
            onClick={() => window.open("Terms")}
          >
            {"Terms"}
          </Button>
        </div>
      </footer>
    </>
  );
}
