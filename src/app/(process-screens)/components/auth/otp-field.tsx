import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import * as SignUp from "@clerk/elements/sign-up";
import clsx from "clsx";
import { Button } from "@/src/app/ui/button";

type AuthOtpFieldProps = {
  buttonText: string;
  loading: boolean;
  mode: "sign-in" | "sign-up";
};

export const AuthOtpField = ({
  buttonText,
  loading,
  mode,
}: AuthOtpFieldProps) => {
  const OtpButton = () => {
    return (
      <Button variant={"cta"} className="w-full" loading={loading}>
        {buttonText}
      </Button>
    );
  };

  return (
    <Clerk.Field name="code" asChild className="relative !w-full !border-0">
      <div className="no-input-border relative !w-full">
        <Clerk.Input
          type="otp"
          className="flex w-full justify-center !border-0 !border-background !text-contrast !outline-none !ring-0 has-[:disabled]:opacity-50"
          autoSubmit
          render={({ value, status }) => {
            return (
              <div
                data-status={status}
                className={clsx(
                  "relative z-10 flex size-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
                  {
                    "z-10 ring-2 ring-ring ring-offset-background":
                      status === "cursor" || status === "selected",
                  },
                )}
              >
                {value}
                {status === "cursor" && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-px animate-caret-blink bg-contrast duration-1000" />
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
      <Clerk.FieldError className="text-center text-sm !text-destructive" />

      {mode === "sign-in" && (
        <SignIn.Action submit asChild>
          <OtpButton />
        </SignIn.Action>
      )}
      {mode === "sign-up" && (
        <SignUp.Action submit asChild>
          <OtpButton />
        </SignUp.Action>
      )}
    </Clerk.Field>
  );
};
