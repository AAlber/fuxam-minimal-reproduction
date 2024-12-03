import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/app/ui/button";
import { CardFooter } from "@/src/app/ui/card";
import { Spinner } from "@/src/app/ui/spinner";

export const SignInFooter = ({
  isGlobalLoading,
}: {
  isGlobalLoading: boolean;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  if (!pathname) return null;
  return (
    <CardFooter>
      <div className="grid w-full gap-y-4">
        <SignIn.Action submit asChild>
          <Button disabled={isGlobalLoading} variant={"cta"}>
            <Clerk.Loading>
              {(isLoading) => {
                return isLoading ? <Spinner /> : "continue";
              }}
            </Clerk.Loading>
          </Button>
        </SignIn.Action>

        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-muted-contrast">
            {"no account"}
          </span>
          <Button
            variant={"link"}
            size={"small"}
            className="p-0"
            onClick={() => {
              if (!searchParams) return router.push("/sign-up");
              const queryString = searchParams.toString();
              router.push(`/sign-up?${queryString}`);
            }}
          >
            {"sign up"}
          </Button>
        </div>
      </div>
    </CardFooter>
  );
};
