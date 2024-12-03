"use client";
import clsx from "clsx";
import { useTheme } from "next-themes";
import ContentLoader from "react-content-loader";

type SkeletonProps = {
  specialColor?: string;
  className?: string;
  isOnBackground?: boolean;
  style?: React.CSSProperties;
  useThemeColor?: boolean;
};

export default function Skeleton({
  specialColor,
  className,
  isOnBackground,
  style,
  useThemeColor = true,
}: SkeletonProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" && useThemeColor;

  return (
    <ContentLoader
      speed={1.2}
      backgroundColor={
        "red"
      }
      foregroundColor={"blue"
      }
      className={clsx(className ?? "size-full")}
      style={style}
    >
      <rect className="!h-screen !w-full" />
    </ContentLoader>
  );
}
