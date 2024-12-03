import AuthMethod from "../../../../components/auth/auth-method";

export const SignInConnections = ({
  isGlobalLoading,
}: {
  isGlobalLoading: boolean;
}) => {
  return (
    <div className="grid grid-cols-2 gap-x-4">
      <AuthMethod.LinkedIn isGlobalLoading={isGlobalLoading} />
      {/* <Clerk.Connection name="microsoft" asChild>
                        <Button
                          size="small"
                          variant="outline"
                          type="button"
                          disabled={isGlobalLoading}
                        >
                          <Clerk.Loading scope="provider:microsoft">
                            {(isLoading) =>
                              isLoading ? (
                                <Spinner />
                              ) : (
                                <>
                                  <Window className="mr-2 size-4" />
                                  
                                </>
                              )
                            }
                          </Clerk.Loading>
                        </Button>
                      </Clerk.Connection> */}
    </div>
  );
};
