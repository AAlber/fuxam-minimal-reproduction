import * as SignUp from "@clerk/elements/sign-up";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/app/ui/card";
import { AuthOtpField } from "../../../../components/auth/otp-field";

export const SignUpStepVerification = ({
  isGlobalLoading,
}: {
  isGlobalLoading: boolean;
}) => {

  return (
    <SignUp.Step name="verifications" className="w-full">
      <Card className="w-full border-0 bg-transparent sm:w-96">
        <CardHeader className="text-center">
          <CardTitle>{"verify email title"}</CardTitle>
          <CardDescription>
            {"verify email description"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex w-full flex-col gap-y-4">
          <AuthOtpField
            buttonText={"finish registration"}
            loading={isGlobalLoading}
            mode="sign-up"
          />
        </CardContent>
      </Card>
    </SignUp.Step>
  );
};
