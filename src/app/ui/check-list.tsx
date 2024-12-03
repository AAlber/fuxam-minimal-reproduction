import clsx from "clsx";
import { ArrowRight, Check, X } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const CheckList = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <ul className={clsx("flex flex-col gap-1", className)}>{children}</ul>;
};

type ItemProps = {
  text: React.ReactNode;
  secondaryText?: string;
  className?: string;
  type?: "check" | "cross" | "arrow";
  variant?: "positive" | "negative" | "neutral";
};

const Item = ({
  text,
  className = "",
  type = "check",
  variant = "neutral",
  secondaryText,
}: ItemProps) => {
  const { t } = useTranslation("page");
  const color =
    variant === "positive"
      ? "text-positive"
      : variant === "negative"
      ? "text-destructive"
      : "text-contrast";

  return (
    <div className={clsx(secondaryText ? "flex justify-between" : "")}>
      <p className={clsx("flex items-center gap-2", className)}>
        {type === "check" && <Check className={clsx("size-3.5", color)} />}
        {type === "cross" && <X className={clsx("size-3.5", color)} />}
        {type === "arrow" && <ArrowRight className={clsx("size-3.5", color)} />}
        {typeof text === "string" ? (
          <span className="flex items-center gap-2 text-sm">{t(text)}</span>
        ) : (
          text
        )}
      </p>
      {secondaryText && (
        <div className="pl-4 text-muted-contrast">{t(secondaryText)}</div>
      )}
    </div>
  );
};

Item.displayName = "Checklist Item";

CheckList.Item = Item;

export default CheckList;
