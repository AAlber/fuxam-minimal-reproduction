import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/app/ui/card";
import clsx from "clsx";

export const SignInEmailCodeField = () => {
  return (
    <SignIn.Strategy name="email_code">
      <Card className="border-0">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We sent a code to{" "}
            <span className="!text-contrast">
              <SignIn.SafeIdentifier />
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Clerk.Field name="code" asChild className="!w-full !border-0">
            <div className="no-input-border !w-full">
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
            <Clerk.FieldError className="text-sm !text-destructive" />
          </Clerk.Field>
        </CardContent>
      </Card>
    </SignIn.Strategy>
  );
};
