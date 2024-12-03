import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/app/ui/card";
import { SignInConnections } from "./connections";
import { SignInEmailField } from "./email-field";
import { SignInFooter } from "./footer";

const SignInStepStart = ({ isGlobalLoading }: { isGlobalLoading: boolean }) => {


  return (
    <SignIn.Step name="start">
      <Card className="w-full border-0 bg-transparent sm:w-96">
        <CardHeader className="text-center">
          <CardTitle>{"step start title"}</CardTitle>
          <CardDescription>
            {"step start description"}
          </CardDescription>
        </CardHeader>
        <Clerk.GlobalError className="text-sm text-destructive" />
        <CardContent className="grid gap-y-4">
          <SignInConnections isGlobalLoading={isGlobalLoading} />
          <p className="flex items-center gap-x-3 text-sm text-muted-contrast before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
              {"or"}
          </p>
          <SignInEmailField />
        </CardContent>
        <SignInFooter isGlobalLoading={isGlobalLoading} />
      </Card>
    </SignIn.Step>
  );
};

export default SignInStepStart;
