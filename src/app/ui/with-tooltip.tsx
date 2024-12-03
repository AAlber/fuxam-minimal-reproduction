"use client";
import { HelpCircle } from "lucide-react";
import { HoverCard, HoverCardSheet, HoverCardTrigger } from "./hover-card";

export type WithToolTipProps = {
  text?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  delay?: number;
  className?: string;
  node?: React.ReactNode;
  asChild?: boolean;
};

export default function WithToolTip({
  side = "bottom",
  delay = 100,
  asChild,
  ...props
}: WithToolTipProps) {
  if (props.disabled) return props.children as JSX.Element;

  return (
    <HoverCard openDelay={delay} closeDelay={0}>
      <HoverCardTrigger className={props.className} asChild={asChild}>
        {props.children ? (
          props.children
        ) : (
          <HelpCircle className="size-4 text-muted-contrast" />
        )}
      </HoverCardTrigger>
      <HoverCardSheet side={side} className="break-words font-normal">
        {props.node ? props.node : props.text || ""}
      </HoverCardSheet>
    </HoverCard>
  );
}
