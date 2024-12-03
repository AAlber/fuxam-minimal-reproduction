import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Input as ShadcnInput } from "./input";

type InputWithLimitCounterProps = {
  text?: string;
  setText: (text: any) => void;
  placeholder?: string;
  maxLength?: number;
  showCount?: boolean;
  number?: boolean;
  password?: boolean;
  error?: boolean;
  disabled?: boolean;
};

export default function InputWithLimitCounter({
  text,
  setText,
  placeholder = "",
  maxLength = 0,
  number = false,
  showCount = true,
  password = false,
  error = false,
  disabled = false,
}: InputWithLimitCounterProps) {
  const { t } = useTranslation("page");

  return (
    <div className="relative flex w-full items-center">
      <ShadcnInput
        name="title"
        id="title"
        type={
          number === true ? "number" : password === true ? "password" : "text"
        }
        disabled={disabled}
        maxLength={maxLength > 0 ? maxLength : undefined}
        value={text}
        onChange={(e) => {
          if (number === true) {
            if (!Number.isNaN(Number(e.target.value))) {
              setText(Number(e.target.value));
            }
          } else {
            setText(e.target.value);
          }
        }}
        autoFocus
        placeholder={t(placeholder)}
        className={clsx(
          error ? "border-destructive" : "",
          "block h-8 w-full min-w-0 grow rounded-md border px-2 text-contrast",
        )}
      />
      {maxLength > 0 && showCount == true && (
        <div className="absolute right-1 top-1 flex h-6 w-8 cursor-default select-none items-center justify-center rounded-[4px] border border-border bg-background text-xs text-contrast ring-0">
          {maxLength - (text ? text.length : 0)}
        </div>
      )}
    </div>
  );
}
