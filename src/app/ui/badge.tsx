import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-1.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "rounded-full border border-accent bg-foreground text-contrast  hover:bg-foreground/80",
        secondary:
          "rounded-full border-transparent bg-accent/60 text-muted-contrast hover:bg-secondary/80",
        destructive:
          "text-destructive-foreground rounded-full border-transparent bg-destructive  hover:bg-destructive/80",
        warning:
          "rounded-full border-warning-contrast/30 bg-warning text-contrast  hover:bg-warning/80",
        outline: "border border-border text-contrast",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={clsx(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
