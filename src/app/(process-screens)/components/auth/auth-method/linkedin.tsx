import * as Clerk from "@clerk/elements/common";
import { Button } from "@/src/app/ui/button";
import { Spinner } from "@/src/app/ui/spinner";

export const LinkedIn = ({ isGlobalLoading }: { isGlobalLoading: boolean }) => {


  return (
    <Clerk.Connection name="linkedin" asChild>
      <Button
        variant="outline"
        type="button"
        disabled={isGlobalLoading}
        className="col-span-2"
      >
        <Clerk.Loading scope="provider:linkedin">
          {(isLoading) =>
            isLoading ? (
              <Spinner />
            ) : (
              <div className="flex items-center gap-2">
                <Clerk.Icon className="size-4" />
                {"Linkedin"}
              </div>
            )
          }
        </Clerk.Loading>
      </Button>
    </Clerk.Connection>
  );
};
