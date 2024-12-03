import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { Button } from "@/src/app/ui/button";
import { CardFooter } from "@/src/app/ui/card";
import { Spinner } from "@/src/app/ui/spinner";

export const SignInVerificationsFooter = ({
  isGlobalLoading,
}: {
  isGlobalLoading: boolean;
}) => {
  return (
    <CardFooter className="flex !w-full flex-col items-start gap-2 pt-2">
      <SignIn.Action submit asChild>
        <Button disabled={isGlobalLoading} className="w-full">
          <Clerk.Loading>
            {(isLoading) => {
              return isLoading ? <Spinner /> : "Continue";
            }}
          </Clerk.Loading>
        </Button>
      </SignIn.Action>
      <SignIn.Action
        navigate="start"
        asChild
        className="mx-auto mt-2 flex justify-center"
      >
        <Button
          variant={"link"}
          size={"small"}
          className="flex gap-2 p-0 text-sm"
        >
          Change email
        </Button>
      </SignIn.Action>
    </CardFooter>
  );
};
