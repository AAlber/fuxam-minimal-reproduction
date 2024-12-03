"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/app/ui/button";
import { Language } from "../page";

export default function WelcomeButtons({
  params: { lang },
}: {
  params: { lang: Language };
}) {
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get("redirect_url")
    ? `?redirect_url=${searchParams.get("redirect_url")}`
    : "";

  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="flex flex-col items-center justify-center gap-2 px-6">
        <Link href={`/${lang}/sign-up${redirectParam}`} className="w-full">
          <Button variant={"cta"} className="w-full">
            {"create new account"}
          </Button>
        </Link>
        <Link href={`/${lang}/sign-in${redirectParam}`} className="w-full">
          <Button variant={"outline"} className="w-full">
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
