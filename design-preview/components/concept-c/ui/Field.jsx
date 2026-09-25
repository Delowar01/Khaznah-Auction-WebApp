"use client";

import { useId } from "react";
import { CircleAlert } from "lucide-react";
import { RIYAL } from "@/lib/format";
import { cx } from "./cx";

export const FIELD_BOX =
  "flex items-center rounded-control border bg-surface transition-[border-color,box-shadow] duration-150 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15";

/**
 * Labelled text field with hint and error states. `money` adds a Riyal
 * prefix and forces left-to-right digits. `forceState` is for the
 * components board ("focus" | "error").
 */
export function TextField({
  label,
  hideLabel = false,
  hint,
  error,
  money = false,
  size = "md",
  icon: Icon,
  forceState,
  className = "",
  inputClassName = "",
  id: idProp,
  end,
  ...props
}) {
  const autoId = useId();
  const id = idProp || autoId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const invalid = Boolean(error) || forceState === "error";
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className={cx("mb-1.5 block kb-sm font-semibold text-fg", hideLabel && "sr-only")}>
        {label}
      </label>
      <div
        className={cx(
          FIELD_BOX,
          size === "lg" ? "h-12" : size === "sm" ? "h-9" : "h-11",
          invalid ? "border-danger focus-within:border-danger focus-within:ring-danger/15" : "border-line-strong hover:border-fg-3",
          forceState === "focus" && "border-primary ring-4 ring-primary/15",
          forceState === "error" && "ring-4 ring-danger/15",
          props.disabled && "border-line bg-surface-2 hover:border-line",
        )}
      >
        {money ? (
          <span aria-hidden="true" className="ps-3 font-bold text-fg-2">
            {RIYAL}
          </span>
        ) : Icon ? (
          <Icon aria-hidden="true" className="ms-3 size-4 shrink-0 text-fg-3" />
        ) : null}
        <input
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          dir={money ? "ltr" : undefined}
          className={cx(
            "h-full min-w-0 flex-1 bg-transparent px-3 kb-md text-fg outline-none placeholder:text-fg-3 disabled:cursor-not-allowed disabled:text-fg-3",
            money && "kb-no-spin font-bold tabular",
            inputClassName,
          )}
          {...props}
        />
        {end}
      </div>
      {error ? (
        <p id={errorId} className="mt-1.5 flex items-center gap-1.5 kb-xs font-semibold text-danger">
          <CircleAlert aria-hidden="true" className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className="mt-1.5 kb-xs text-fg-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
