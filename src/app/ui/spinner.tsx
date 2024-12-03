import clsx from "clsx";
import type { ImageProps } from "next/image";
import Image from "next/image";

type Props = Partial<{ size: string } & ImageProps>;

export const Spinner = ({ size = "size-4", className }: Props) => {
  return (
    <Image
      src="/ios-spinner.svg"
      alt="Spinner"
      width={22}
      height={22}
      className={clsx(className, size, "pr-0.5 opacity-50 dark:invert")}
    />
  );
};
