import * as SignIn from "@clerk/elements/sign-in";
import { Mail } from "lucide-react";
import { Button } from "@/src/app/ui/button";
import { Card, CardContent } from "@/src/app/ui/card";
import AuthMethod from "../../../../components/auth/auth-method";

export default function SignInStepForgotPassword({ isGlobalLoading }) {

  return (
    <SignIn.Step name="forgot-password">
      <Card className="w-full border-0 bg-transparent sm:w-96">
        <CardContent className="flex flex-col gap-2 py-0">
          <SignIn.Action navigate="start" asChild>
            <Button variant={"link"}>
              {"change email"}
            </Button>
          </SignIn.Action>
          <SignIn.SupportedStrategy name="reset_password_email_code">
            <Button variant={"cta"} className="w-full">
              {"step reset password title"}
            </Button>
          </SignIn.SupportedStrategy>
          <p className="flex items-center gap-x-3 text-sm text-muted-contrast before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
            {"or"}
          </p>
          <AuthMethod.LinkedIn isGlobalLoading={isGlobalLoading} />
          <SignIn.SupportedStrategy name="email_code" asChild>
            <Button className="flex gap-2">
              <Mail className="size-4" />
              {"Email Code to"} <SignIn.SafeIdentifier />
            </Button>
          </SignIn.SupportedStrategy>
        </CardContent>
      </Card>
    </SignIn.Step>
  );
}
