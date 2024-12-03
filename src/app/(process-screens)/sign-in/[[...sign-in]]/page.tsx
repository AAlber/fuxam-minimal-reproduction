"use client";
import { SignIn } from "@clerk/nextjs";
import { CardDescription, CardHeader, CardTitle } from "@/src/app/ui/card";

export default function SignInPage({
  params: { lang },
}: {
  params: { lang: string };
}) {

  return (
    <>
      <div className="sign-in grid w-full grow items-center justify-center px-4">
        <CardHeader className="text-center">
          <CardTitle>{"sign in"}</CardTitle>
          <CardDescription>
            {"step start description"}
          </CardDescription>
        </CardHeader>
        <div className="flex items-center justify-center">
          <SignIn
            path={`/${lang}/sign-in`}
            routing="path"
            signUpUrl={`/${lang}/sign-up`}
            appearance={{
              elements: {
                rootBox: "border-0 shadow-none !bg-transparent ",
                cardBox: "border-0 shadow-none !bg-transparent",
                card: "bg-transparent border-0 shadow-none pb-2 p-0 pt-2 px-6",
                main: "gap-4",
                backLink:
                  "text-fuxam-pink no-underline hover:text-fuxam-orange ",
                footer: "!bg-none !shadow-none",
                footerAction:
                  "!bg-transparent !border-0 !border-none !shadow-none",
                formButtonPrimary:
                  "bg-primary !text-white !border-0 !border-none !ring-0 hover:bg-primary/80 transition-all duration-200 ease-in-out",
                input:
                  "!shadow-none rounded-md !border !border-input transition-all duration-200 ease-in-out focus:ring-0 focus:!border-primary",
                header: "hidden",
                button:
                  "h-8 p-2 !text-contrast hover:text-muted-contrast transition-all duration-200 ease-in-out",
                socialButtonsBlockButton:
                  "!border !border-input text-contrast !shadow-none !flex !flex-col !justify-start",
                otpCodeField: "!w-full !min-w-full flex justify-center",
                otpCodeFieldInputs: "!flex-1 ",
              },
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "blockButton",
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
