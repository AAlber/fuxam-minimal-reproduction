import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { Button } from "@/src/app/ui/button";
import { CardContent } from "@/src/app/ui/card";
import { Input } from "@/src/app/ui/input";
import { Label } from "@/src/app/ui/label";

export const SignInPasswordField = () => {
  return (
    <CardContent className="grid gap-y-4 py-0">
      <Clerk.Field name="password" className="space-y-2">
        <Clerk.Label asChild>
          <Label className="flex items-center justify-between">
            Password
            <SignIn.Action
              navigate="forgot-password"
              asChild
              className="flex w-full justify-center"
            >
              <Button
                variant={"link"}
                size={"small"}
                className="w-auto p-0 text-xs"
              >
                Forgot password?
              </Button>
            </SignIn.Action>
          </Label>
        </Clerk.Label>
        <Clerk.Input type="password" asChild>
          <Input />
        </Clerk.Input>
        <Clerk.FieldError className="block text-sm text-destructive" />
      </Clerk.Field>
    </CardContent>
  );
};
