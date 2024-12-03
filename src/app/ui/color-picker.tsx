"use client";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Input } from "@/src/app/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/app/ui/popover";
import { Button } from "./button";

type ColorPickerProps = {
  color?: string;
  onChange: (color: string) => void;
};

export default function ColorPicker({
  color = "#FF5675",
  onChange,
}: ColorPickerProps) {
  const [_color, setColor] = useState(color);

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant={"outline"}
          className="flex items-center gap-2 rounded-md border border-border p-2"
        >
          <div
            className="size-5 rounded-full"
            style={{ backgroundColor: _color }}
          />
          <span className="text-sm uppercase">{_color}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          <Input
            data-testid="colorpicker-input"
            maxLength={7}
            value={_color}
            className="max-w-[200px]"
            onChange={(e) => {
              setColor(e.target.value);
              onChange(e.target.value);
            }}
          />
          <HexColorPicker
            className="!w-full !rounded-lg !border !border-border"
            color={_color}
            onChange={(color) => {
              setColor(color);
              onChange(color);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
