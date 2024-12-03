import * as Clerk from "@clerk/elements/common";
import { Input } from "@/src/app/ui/input";
import { Label } from "@/src/app/ui/label";

export const SignUpNameFields = () => {

  return (
    <div className="flex w-full gap-2">
      <Clerk.Field name={"firstName"}>
        <Clerk.Label asChild>
          <Label className="text-sm">{"first name"}</Label>
        </Clerk.Label>
        <Clerk.Input asChild>
          <Input />
        </Clerk.Input>
      </Clerk.Field>
      <Clerk.Field name={"lastName"}>
        <Clerk.Label asChild>
          <Label className="text-sm">{"last name"}</Label>
        </Clerk.Label>
        <Clerk.Input asChild>
          <Input />
        </Clerk.Input>
        <Clerk.FieldError className="text-sm text-destructive" />
      </Clerk.Field>
    </div>
  );
};
