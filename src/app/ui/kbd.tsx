import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

const kbdVariants = cva(
  "flex select-none items-center rounded border px-1 font-mono text-xs disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-accent-foreground border border-border bg-accent",
        button: "ml-1 border-0 bg-transparent opacity-60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface KbdProps
  extends React.ComponentPropsWithoutRef<"kbd">,
    VariantProps<typeof kbdVariants> {
  /**
   * The title of the `abbr` element inside the `kbd` element.
   * @default undefined
   * @type string | undefined
   * @example title="Command"
   */
  abbrTitle?: string;
}

const Kbd = React.forwardRef<HTMLUnknownElement, KbdProps>(
  ({ abbrTitle, children, className, variant, ...props }, ref) => {
    return (
      <kbd className={clsx(kbdVariants({ variant, className }))} {...props}>
        {children}
      </kbd>
    );
  },
);
Kbd.displayName = "Kbd";

export { Kbd };
