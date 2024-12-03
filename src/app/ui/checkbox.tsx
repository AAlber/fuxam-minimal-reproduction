import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { Asterisk, CheckIcon, X } from "lucide-react";
import * as React from "react";

const checkboxVariants = cva(
  "peer flex shrink-0 items-center justify-center rounded-sm border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "size-4 border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary/70 data-[state=checked]:text-contrast",
        destructive:
          "data-[state=checked]border-destructive size-4 border-border data-[state=checked]:border-destructive data-[state=checked]:bg-destructive/70 data-[state=checked]:text-contrast",
        muted:
          "data-[state=checked]border-muted size-4 border-border data-[state=checked]:border-muted data-[state=checked]:bg-muted/70 data-[state=checked]:text-contrast",
        positive:
          "data-[state=checked]border-positive size-4 border-border data-[state=checked]:border-positive data-[state=checked]:bg-positive/70 data-[state=checked]:text-contrast",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  icon?: "check" | "cross" | "line";
  description?: string;
  link?: string;
  linkName?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      variant,
      icon = "check",
      title,
      link,
      linkName,
      description,
      ...props
    },
    ref,
  ) => {
    const iconComponent = {
      check: <CheckIcon className="size-3 text-white" />,
      cross: <X className="size-4 text-white" />, // Adjust with the actual component and styles
      line: <Asterisk className="size-4 text-white" />, // Adjust with the actual component and styles
    };

    const hasOptionals = title || description || link || linkName;

    return (
      <>
        {hasOptionals && (
          <div>
            <span>
              {title}
              {link && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                  href={link}
                >
                  {linkName}
                </a>
              )}
            </span>
            {description && (
              <p className="text-xs text-muted-contrast">{description}</p>
            )}
          </div>
        )}
        <CheckboxPrimitive.Root
          ref={ref}
          className={clsx(checkboxVariants({ variant, className }))}
          {...props}
        >
          <CheckboxPrimitive.Indicator
            className={clsx(
              "flex items-center justify-center text-lg font-bold",
            )}
          >
            {iconComponent[icon]}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
      </>
    );
  },
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox, checkboxVariants };
