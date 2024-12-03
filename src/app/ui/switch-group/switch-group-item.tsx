import clsx from "clsx";
import { Badge } from "@/src/app/ui/badge";
import { Switch } from "../switch";

export default function SwitchGroupItem({
  checked,
  onChange,
  label,
  description,
  badgeText,
  showBadge,
  badgeColor = "blue",
  disabled = false,
  descriptionInLine = false,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  showBadge?: boolean;
  badgeText?: string;
  badgeColor?: "blue" | "green";
  disabled?: boolean;
  descriptionInLine?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        description ? "items-start" : "items-center",
        "flex items-center justify-between gap-3 text-sm text-contrast",
        className,
      )}
    >
      <div
        className={clsx(
          "flex",
          descriptionInLine
            ? "relative flex-row items-center gap-1"
            : "flex-col",
        )}
      >
        <div className="flex gap-x-2">
          <h1 className="font-medium text-contrast">{label}</h1>
          {showBadge && <Badge title={badgeText} color={badgeColor} />}
        </div>
        {description && (
          <p
            className={clsx(
              "text-xs text-muted-contrast",
              descriptionInLine && "mt-0.5",
            )}
          >
            {description}
          </p>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
