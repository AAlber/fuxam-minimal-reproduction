// StackedProgressBar.tsx
import clsx from "clsx";
import React from "react";
import Skeleton from "@/src/app/ui/skeleton";
import WithToolTip from "./with-tooltip";

type CategoryColor =
  | "blue"
  | "purple"
  | "primary"
  | "green"
  | "red"
  | "yellow"
  | "orange";

const colorClasses: Record<CategoryColor, string> = {
  blue: "from-blue-500 to-blue-400",
  purple: "from-purple-500 to-purple-400",
  primary: "from-primary to-primary/80",
  green: "from-green-500 to-green-400",
  red: "from-red-500 to-red-400",
  yellow: "from-yellow-500 to-yellow-400",
  orange: "from-orange-500 to-orange-400",
};

export type ProgressBarCategory = {
  value: number;
  color: CategoryColor;
  title?: string;
  valueFormatter?: (value: number) => string;
};

type DefaultStackedProgressBarProps = {
  state?: "default";
  total: number;
  categories?: ProgressBarCategory[];
  showTooltipOnCategories?: boolean;
  showLegend?: boolean;
  className?: string;
  children?: React.ReactNode;
  categoryChildren?: React.ReactNode;
};

type LoadingStackedProgressBarProps = {
  state: "loading";
};

type ErrorStackedProgressBarProps = {
  state: "error";
};

type StackedProgressBarProps =
  | DefaultStackedProgressBarProps
  | LoadingStackedProgressBarProps
  | ErrorStackedProgressBarProps;

export const StackedProgressBar: React.FC<StackedProgressBarProps> = (data) => {
  if (data.state === "loading") {
    return <LoadingStackedProgressBar />;
  }

  if (data.state === "error" || !data.categories) {
    return <ErrorStackedProgressBar />;
  }

  return (
    <div className="flex flex-col">
      <div
        className={clsx(
          "relative flex h-8 w-full overflow-hidden rounded-lg bg-background",
          data.className,
        )}
      >
        {data.categories.map((category, i) => {
          return (
            <div
              key={i}
              style={{
                width: `${(category.value / data.total) * 100}%`,
              }}
              className={clsx(
                data.showTooltipOnCategories && "hover:opacity-80",
                colorClasses[category.color],
                i === data.categories!.length - 1 && "ml-px",
                "relative h-full bg-gradient-to-t",
              )}
            >
              <CategoryTooltip data={data} category={category}>
                <div className="size-full">{data.categoryChildren}</div>
              </CategoryTooltip>
            </div>
          );
        })}
        {data.children}
      </div>
      {data.showLegend && (
        <div className="mt-4 flex flex-col gap-2">
          {data.categories.map((category, i) => (
            <CategoryTooltip
              data={data}
              category={category}
              key={category.value}
            >
              <div key={i} className="flex items-center gap-2">
                <div
                  className={clsx(
                    colorClasses[category.color],
                    "size-3 rounded-sm bg-gradient-to-t",
                  )}
                />
                <span className="text-xs text-muted-contrast">
                  {category.title}
                </span>
              </div>
            </CategoryTooltip>
          ))}
        </div>
      )}
    </div>
  );
};

const LoadingStackedProgressBar: React.FC = () => {
  return (
    <div
      className={clsx(
        "flex h-8 w-full overflow-hidden rounded-lg bg-background",
      )}
    >
      <Skeleton />
    </div>
  );
};

const ErrorStackedProgressBar: React.FC = () => {
  return (
    <div
      className={clsx(
        "flex h-8 w-full items-center overflow-hidden rounded-lg bg-destructive/30 p-2 text-destructive",
      )}
    >
      {"unexpected error"}
    </div>
  );
};

const CategoryTooltip = ({
  data,
  category,
  children,
}: {
  data: DefaultStackedProgressBarProps;
  category: ProgressBarCategory;
  children: React.ReactNode;
}) => {
  return (
    <WithToolTip
      className="size-full"
      disabled={!data.showTooltipOnCategories}
      side="left"
      node={
        <div className="flex items-center gap-2 p-1 text-xs text-muted-contrast">
          <div
            className={clsx(
              colorClasses[category.color],
              "size-3 rounded-sm bg-gradient-to-t",
            )}
          />
          {category.title}{" "}
          <span className="font-mono font-medium tabular-nums text-contrast">
            {category.valueFormatter
              ? category.valueFormatter(category.value)
              : category.value}
          </span>
        </div>
      }
    >
      {children}
    </WithToolTip>
  );
};
