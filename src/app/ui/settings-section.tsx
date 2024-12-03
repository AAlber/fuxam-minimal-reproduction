"use client";
import type { VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { useState } from "react";
import type { buttonVariants } from "@/src/app/ui/button";
import { Button } from "@/src/app/ui/button";
import { Spinner } from "@/src/app/ui/spinner";
import { CardDescription, CardHeader, CardTitle } from "./card";

interface SettingsSectionProps {
  title?: string;
  description?: string;
  noFooter?: boolean;
  loading?: boolean;
  bigContent?: boolean;
  titleClassName?: string;
  footerButtonText?: string;
  footerButtonDisabled?: boolean;
  footerButtonAction?: () => Promise<any>;
  footerButtonVariant?: VariantProps<typeof buttonVariants>["variant"];
  additionalButton?: JSX.Element;
  children: React.ReactNode;
}

export default function SettingsSection(props: SettingsSectionProps) {
  const [loading, setLoading] = useState(false);

  const variant = props.footerButtonVariant ? props.footerButtonVariant : "cta";

  const onButtonAction = async () => {
    if (props.noFooter) return;
    if (!props.footerButtonAction) return;
    if (props.footerButtonDisabled) return;
    setLoading(true);
    await props.footerButtonAction();
    setLoading(false);
  };

  return (
    <section
      className={clsx(
        !props.bigContent && "xl:grid-cols-3",
        "grid grid-cols-1 gap-x-10 gap-y-4 border-b border-border bg-foreground p-6",
      )}
    >
      <CardHeader className="!p-0">
        <CardTitle className="text-xl">
          <div className={props.titleClassName}>{props.title}</div>
          {props.loading && <Spinner size="w-6 h-6" />}{" "}
        </CardTitle>
        {props.description && (
          <CardDescription>{props.description}</CardDescription>
        )}
      </CardHeader>
      <form className="flex flex-col justify-between md:col-span-2">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">{props.children}</div>
        </div>
        {!props.noFooter && (
          <div className="mt-4 flex items-center justify-end gap-2">
            {props.additionalButton && props.additionalButton}
            <Button
              variant={props.footerButtonDisabled ? "default" : variant}
              onClick={onButtonAction}
              disabled={props.footerButtonDisabled || loading}
            >
              {loading ? "loading" : props.footerButtonText!}
            </Button>
          </div>
        )}
      </form>
    </section>
  );
}
