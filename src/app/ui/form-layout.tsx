"use client";
import clsx from "clsx";
import { HelpCircle } from "lucide-react";
import { Label } from "@/src/app/ui/label";
import { Button } from "./button";
import WithToolTip from "./with-tooltip";

const FormLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={clsx("grid w-full grid-cols-3 gap-4", className)}>
      {children}
    </div>
  );
};

const Item = ({
  label,
  description = "",
  extraInfo = "",
  labelStyle = "bold",
  children,
  align = "center",
  descriptionLocation = "tooltip",
}: {
  label: string;
  labelStyle?: "bold" | "normal";
  description?: string;
  extraInfo?: string;
  children: React.ReactNode;
  align?: "top" | "center" | "bottom";
  descriptionLocation?: "tooltip" | "below-children";
}) => {
  return (
    <>
      <Label
        className={clsx(
          "col-span-1 flex flex-col gap-1",
          labelStyle === "bold" ? "font-medium" : "font-normal",
          align === "center"
            ? "justify-center"
            : align === "top"
            ? "justify-start"
            : "justify-end",
        )}
      >
        <div className="relative flex items-center gap-1">
          {label}
          {description && descriptionLocation === "tooltip" && (
            <WithToolTip text={description}>
              <Button variant={"ghost"} size={"iconSm"}>
                <HelpCircle className="size-3.5 text-muted-contrast" />
              </Button>
            </WithToolTip>
          )}
        </div>

        {extraInfo && (
          <span className="mt-2 text-xs font-normal italic text-muted-contrast">
            {extraInfo}
          </span>
        )}
      </Label>
      <div className="col-span-2 flex items-center justify-end">
        {descriptionLocation === "below-children" ? (
          <div>
            {children}
            <span className="text-xs font-normal text-muted-contrast">
              {description}
            </span>
          </div>
        ) : (
          children
        )}
      </div>
    </>
  );
};
Item.displayName = "Item";

const SettingsSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="col-span-3 flex w-full select-none flex-col divide-y divide-border rounded-md border border-border bg-foreground">
      {children}
    </div>
  );
};
SettingsSection.displayName = "SettingsSection";

const SettingsItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid w-full grid-cols-3 gap-4 px-4 py-2">{children}</div>
  );
};
SettingsItem.displayName = "SettingsItem";

const ButtonSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="col-span-3 flex items-center justify-end gap-2">
      {children}
    </div>
  );
};

const FullWidthItem = ({ children }: { children: React.ReactNode }) => {
  return <div className="col-span-full flex flex-col gap-2">{children}</div>;
};
FullWidthItem.displayName = "FullWidthSection";

ButtonSection.displayName = "ButtonSection";

FormLayout.Item = Item;
FormLayout.ButtonSection = ButtonSection;
FormLayout.FullWidthItem = FullWidthItem;
FormLayout.SettingsSection = SettingsSection;
FormLayout.SettingsItem = SettingsItem;

export default FormLayout;
