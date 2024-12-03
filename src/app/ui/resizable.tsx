/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";

import clsx from "clsx";
import { GripVertical } from "lucide-react";
import type { HTMLAttributes, PropsWithChildren, ReactElement } from "react";
import * as ResizablePrimitive from "react-resizable-panels";
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
declare module "react-resizable-panels" {
  export interface PanelResizeHandleProps
    extends Omit<HTMLAttributes<keyof HTMLElementTagNameMap>, "id">,
      PropsWithChildren<object> {}

  export function PanelResizeHandle(
    props: PanelResizeHandleProps,
  ): ReactElement | null;
}

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => {
  return (
    <ResizablePrimitive.PanelGroup
      className={clsx(
        "flex size-full data-[panel-group-direction=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
};

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  withHandle,
  position = "default",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  withHandle: boolean;
  position?: "default" | "left";
  onDragging?: (isDragging: boolean) => void;
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={clsx(
      "group relative flex w-px items-center justify-center bg-border",
      className,
    )}
    {...props}
  >
    {withHandle && (
      <>
        {position === "left" && (
          <div
            className="absolute left-0 h-full w-[20px] -translate-x-full"
            style={{ pointerEvents: "none" }}
          >
            {/* Invisible div that only handles hover events */}
            <div
              className="absolute inset-0"
              style={{ pointerEvents: "auto" }}
              onMouseOver={(e) => {
                e.currentTarget.parentElement?.parentElement?.classList.add(
                  "group-hover",
                );
              }}
              onMouseLeave={(e) => {
                e.currentTarget.parentElement?.parentElement?.classList.remove(
                  "group-hover",
                );
              }}
            />
          </div>
        )}
        <div
          className={clsx(
            "z-10 flex h-5 items-center justify-center rounded-sm transition-all duration-200",
            position === "left"
              ? "absolute left-0 w-0 -translate-x-full border-border bg-foreground group-hover:w-4 group-hover:border group-focus:w-4 group-focus:border"
              : "w-4 border border-border bg-foreground",
          )}
        >
          <GripVertical
            className={clsx(
              "transition-all duration-200",
              position === "left"
                ? "invisible size-2 group-hover:visible group-hover:size-4 group-focus:visible group-focus:size-4"
                : "size-4",
            )}
          />
        </div>
      </>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
