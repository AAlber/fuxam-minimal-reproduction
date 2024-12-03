import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { Button } from "@/src/app/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/app/ui/card";
import { Input } from "@/src/app/ui/input";
import { Spinner } from "@/src/app/ui/spinner";

export default function SignInStepResetPassword({
  isGlobalLoading,
}: {
  isGlobalLoading: boolean;
}) {

  return (
    <SignIn.Step name="reset-password">
      <Card className="w-full border-0 bg-transparent sm:w-96">
        <CardHeader className="text-center">
          <CardTitle>
            {"step reset password title"}
          </CardTitle>
          <CardDescription>
            {"step reset password description"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 py-0">
          <Clerk.Field name="password">
            <Clerk.Label className="text-sm text-contrast">
              {"new password"}
            </Clerk.Label>
            <Clerk.Input type="password" asChild>
              <Input />
            </Clerk.Input>
            <Clerk.FieldError className="w-full text-sm text-destructive" />
          </Clerk.Field>

          <Clerk.Field name="confirmPassword">
            <Clerk.Label className="text-sm text-contrast">
              {"confirm password"}
            </Clerk.Label>
            <Clerk.Input type="password" asChild>
              <Input />
            </Clerk.Input>
            <Clerk.FieldError />
          </Clerk.Field>

          <SignIn.Action submit asChild className="w-full">
            <Button variant={"cta"} disabled={isGlobalLoading}>
              <Clerk.Loading>
                {(isLoading) => {
                  return isLoading ? (
                    <Spinner />
                  ) : (
                    "reset password"
                  );
                }}
              </Clerk.Loading>
            </Button>
          </SignIn.Action>
        </CardContent>
      </Card>
    </SignIn.Step>
  );
}
