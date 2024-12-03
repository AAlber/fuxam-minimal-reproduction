import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Command, CornerDownLeft, Option } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import type { UrlObject } from "url";
import { Kbd } from "./kbd";
import clsx from "clsx";

type KBDType =
  | "cmd+s"
  | "cmd+enter"
  | "enter"
  | "esc"
  | "option+enter"
  | "option+s";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border/50 disabled:text-muted-contrast/50",
  {
    variants: {
      variant: {
        default:
          "bg-accent/80 text-contrast hover:bg-accent/50 disabled:bg-accent/30 dark:bg-secondary",
        destructive:
          "bg-destructive text-white hover:bg-destructive/40 disabled:bg-accent/30",
        cta: "bg-primary text-white hover:bg-primary/80 disabled:bg-accent/30",
        ghost: "text-contrast hover:bg-accent/50 hover:text-muted-contrast",
        link: "text-primary underline-offset-4 hover:underline",
        positive:
          "bg-positive text-positive-contrast hover:bg-positive/40 disabled:bg-accent/30",
        outline:
          "border border-border text-contrast hover:bg-accent/50 hover:text-accent-contrast",
      },
      size: {
        small: "h-6 px-2 py-1",
        default: "h-8 p-2",
        lg: "h-10 rounded-md px-4",
        icon: "size-8",
        iconSm: "size-6",
        button: "h-8 w-20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  title?: string;
  enabled?: boolean;
  loading?: boolean;
  href?: UrlObject | string;
  kbd?: KBDType;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      title = "",
      enabled = true,
      className,
      variant,
      size,
      asChild = false,
      loading,
      disabled,
      href,
      kbd,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    if (href) {
      return (
        <Link href={href}>
          <Comp
            type="button"
            className={clsx(buttonVariants({ variant, size, className }))}
            ref={ref}
            disabled={disabled || loading}
            {...props}
          >
            {props.children}
            {kbd && <KbdButton type={kbd} />}
          </Comp>
        </Link>
      );
    }
    return (
      <Comp
        type="button"
        className={clsx(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {props.children}
        {kbd && <KbdButton type={kbd} />}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

const KbdButton = ({ type }: { type: KBDType }) => (
  <Kbd variant={"button"}>
    {type === "cmd+s" && (
      <>
        <Command className="size-3" strokeWidth={2.5} />
        <span>S</span>
      </>
    )}
    {type === "cmd+enter" && (
      <>
        <Command className="size-3" strokeWidth={2.5} />
        <CornerDownLeft className="size-3.5" />
      </>
    )}
    {type === "enter" && <CornerDownLeft className="size-3.5" />}
    {type === "esc" && "ESC"}
    {type === "option+enter" && (
      <>
        <Option className="size-3" strokeWidth={2.5} />
        <CornerDownLeft className="size-3.5" />
      </>
    )}
    {type === "option+s" && (
      <>
        <Option className="size-3" strokeWidth={2.5} />
        <span>S</span>
      </>
    )}
  </Kbd>
);
