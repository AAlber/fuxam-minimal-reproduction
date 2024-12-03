import * as SignUp from "@clerk/elements/sign-up";
import { Button } from "@/src/app/ui/button";
import { CardFooter } from "@/src/app/ui/card";

export const SignUpStartFooter = ({
  isGlobalLoading,
}: {
  isGlobalLoading: boolean;
}) => {

  return (
    <CardFooter className="flex w-full flex-col gap-2 px-0">
      <SignUp.Action submit asChild>
        <Button variant={"cta"} disabled={isGlobalLoading} className="w-full">
          {"continue"}
        </Button>
      </SignUp.Action>

      <div className="flex items-center gap-px">
        <span className="text-sm text-muted-contrast">
          {"have account"}
        </span>{" "}
        <Button variant={"link"} size={"small"} href="/sign-in">
          {"sign in"}
        </Button>
      </div>
    </CardFooter>
  );
};
