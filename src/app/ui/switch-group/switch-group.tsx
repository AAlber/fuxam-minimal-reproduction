import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";
import React from "react";

type Props = {
  children: ReactNode;
  className?: string;
} & ComponentProps<"div">;

export default function SwitchGroup({ children, className, ...rest }: Props) {
  // Convert children to an array and map over it to add conditional padding
  const childrenArray = React.Children.toArray(children);
  const paddedChildren = childrenArray.map((child, index) => {
    // Apply top padding to the last child and bottom padding to the first child
    const isFirst = index === 0;
    const isLast = index === childrenArray.length - 1;
    const paddingClass = clsx({
      "pt-2": isLast,
      "pb-2": isFirst,
      "py-2": !isFirst && !isLast,
    });

    return (
      <div key={index} className={paddingClass}>
        {child}
      </div>
    );
  });

  return (
    <div
      className={clsx(
        "flex flex-col divide-y divide-border rounded-md border border-none border-border",
        className,
      )}
      {...rest}
    >
      {paddedChildren}
    </div>
  );
}
