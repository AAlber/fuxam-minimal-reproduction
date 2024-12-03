import * as SignIn from "@clerk/elements/sign-in";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/app/ui/card";
import { SignInEmailCodeField } from "./email-code-field";
import { SignInVerificationsFooter } from "./footer";
import { SignInPasswordField } from "./password-field";
import { ResetPasswordCodeField } from "./reset-password-code-field";

const SignInStepVerifications = ({
  isGlobalLoading,
}: {
  isGlobalLoading: boolean;
}) => {

  return (
    <SignIn.Step name="verifications">
      <SignIn.Strategy name="password">
        <Card className="w-full border-0 bg-transparent sm:w-96">
          <CardHeader className="text-center">
            <CardTitle className="!mt-2">
              {"step verification title"}
              <SignIn.SafeIdentifier />
            </CardTitle>
            <CardDescription>
              {"step verification description"}
            </CardDescription>
          </CardHeader>
          <SignInPasswordField />
          <SignInVerificationsFooter isGlobalLoading={isGlobalLoading} />
        </Card>
      </SignIn.Strategy>
      <ResetPasswordCodeField />
      <SignInEmailCodeField />
    </SignIn.Step>
  );
};

export default SignInStepVerifications;
