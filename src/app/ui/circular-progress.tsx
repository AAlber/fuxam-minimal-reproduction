import clsx from "clsx";
import React from "react";

interface CircularProgressProps extends React.SVGProps<SVGSVGElement> {
  value: number;
  size?: "sm" | "md" | "lg";
  strokeWidth?: number;
}

export const CircularProgress = React.forwardRef<
  SVGSVGElement,
  CircularProgressProps
>(({ value, size = "md", strokeWidth = 4, className, ...props }, ref) => {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg
      className={clsx(sizeClass[size], "-rotate-90", className)}
      viewBox="0 0 100 100"
      ref={ref}
      {...props}
    >
      <circle
        className="stroke-primary/20"
        strokeWidth={strokeWidth}
        fill="none"
        cx="50"
        cy="50"
        r={radius}
      />
      <circle
        className="stroke-primary transition-all duration-300 ease-in-out"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        fill="none"
        cx="50"
        cy="50"
        r={radius}
      />
    </svg>
  );
});

CircularProgress.displayName = "CircularProgress";
