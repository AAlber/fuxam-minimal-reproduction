import * as Clerk from "@clerk/elements/common";
import { Input } from "@/src/app/ui/input";
import { Label } from "@/src/app/ui/label";

export const SignUpEmailField = () => {

  return (
    <Clerk.Field name={"emailAddress"}>
      <Clerk.Label asChild>
        <Label className="text-sm">{"email address"}</Label>
      </Clerk.Label>
      <Clerk.Input required type="email" asChild>
        <Input required type="email" />
      </Clerk.Input>
      <Clerk.FieldError className="text-sm text-destructive" />
    </Clerk.Field>
  );
};
