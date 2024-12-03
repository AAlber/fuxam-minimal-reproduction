import * as Clerk from "@clerk/elements/common";
import { Input } from "@/src/app/ui/input";
import { Label } from "@/src/app/ui/label";

export const SignInEmailField = () => {
  return (
    <Clerk.Field name="identifier" className="space-y-2">
      <Clerk.Label asChild>
        <Label>{"email address"}</Label>
      </Clerk.Label>
      <Clerk.Input type="email" required asChild>
        <Input />
      </Clerk.Input>
      <Clerk.FieldError className="block text-sm text-destructive" />
    </Clerk.Field>
  );
};
