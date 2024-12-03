import * as Clerk from "@clerk/elements/common";
import clsx from "clsx";
import { CheckCircle2, CircleAlert, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/src/app/ui/button";
import { Input } from "@/src/app/ui/input";
import { Label } from "@/src/app/ui/label";

export const SignUpPasswordField = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [helperText, setHelperText] = useState("");
  const [showError, setShowError] = useState(false);

  const handleClick = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (password.length < 8) {
      setHelperText("password helper text");
    }
    if (password.length === 0) {
      setHelperText("");
    }
    if (password.length >= 8) {
      setHelperText("password success");
    }
  }, [password]);

  return (
    <Clerk.Field name={"password"}>
      <Clerk.Label asChild>
        <Label className="text-sm">Password</Label>
      </Clerk.Label>
      <Clerk.Input required asChild type={showPassword ? "text" : "password"}>
        <div className="flex flex-col gap-1 border-0 p-0">
          <div className="relative flex items-center justify-end rounded-md border-0 p-0">
            <Input
              type={showPassword ? "text" : "password"}
              onFocus={() => setShowError(false)}
              onBlur={() => {
                if (password.length < 8) {
                  setShowError(true);
                  setHelperText("password helper text");
                }
              }}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Button
              variant={"ghost"}
              size={"iconSm"}
              className="absolute mr-2"
              onClick={handleClick}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
          <div className="flex gap-1">
            {password.length >= 8 && (
              <CheckCircle2 className="size-4 fill-positive text-white" />
            )}
            {showError && (
              <CircleAlert className="size-4 fill-destructive text-white" />
            )}
            <p
              className={clsx(
                "text-xs",
                showError ? "text-destructive" : "text-muted-contrast",
              )}
            >
              {helperText}
            </p>
          </div>
        </div>
      </Clerk.Input>
      <Clerk.FieldError className="text-sm text-destructive" />
    </Clerk.Field>
  );
};
