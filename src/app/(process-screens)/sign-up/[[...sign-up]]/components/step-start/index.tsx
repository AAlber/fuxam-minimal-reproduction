import * as SignUp from "@clerk/elements/sign-up";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/app/ui/card";
import AuthMethod from "../../../../components/auth/auth-method";
import { SignUpEmailField } from "./email-field";
import { SignUpStartFooter } from "./footer";
import { SignUpNameFields } from "./name-fields";
import { SignUpPasswordField } from "./password-field";

export const SignUpStepStart = ({ isGlobalLoading }) => {
  return (
    <SignUp.Step name="start" className="w-full">
      <Card className="w-full border-0 bg-transparent sm:w-96">
        <CardHeader className="text-center">
          <CardTitle>{"welcome fuxam"}!</CardTitle>
        </CardHeader>
        <CardContent className="flex w-full flex-col gap-y-4">
          <AuthMethod.LinkedIn isGlobalLoading={isGlobalLoading} />
          <p className="flex w-full items-center gap-x-3 text-sm text-muted-contrast before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
            {"or"}
          </p>
          <SignUpNameFields />
          <SignUpEmailField />
          <SignUpPasswordField />
          <SignUpStartFooter isGlobalLoading={isGlobalLoading} />
        </CardContent>
      </Card>
    </SignUp.Step>
  );
};
