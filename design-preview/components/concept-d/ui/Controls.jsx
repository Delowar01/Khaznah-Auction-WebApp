"use client";

import { useId } from "react";
import { AlertCircle } from "lucide-react";

/** Row switch (role="switch"); the whole row is the control. */
export function Switch({ checked, onChange, label, hint, className = "" }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`group flex min-h-11 w-full items-center justify-between gap-4 rounded-control px-1 text-start ${className}`}
    >
      <span className="min-w-0">
        <span className="block text-sm text-fg">{label}</span>
        {hint ? <span className="block text-xs text-fg-3">{hint}</span> : null}
      </span>
      <span
        aria-hidden="true"
        className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors ${checked ? "bg-primary" : "bg-[var(--d-track)] ring-1 ring-inset ring-line-strong"}`}
      >
        <span className={`size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? "translate-x-4 rtl:-translate-x-4" : ""}`} />
      </span>
    </button>
  );
}

/**
 * Text input with visible (or visually hidden) label and error state.
 * `forceState` renders the focused look statically for the components board.
 */
export function TextField({ label, hideLabel = false, error, hint, prefix, suffix, id, className = "", inputClassName = "", forceState, ...props }) {
  const autoId = useId();
  const fieldId = id || autoId;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;
  const focused = forceState === "focus";
  return (
    <div className={className}>
      <label htmlFor={fieldId} className={hideLabel ? "sr-only" : "mb-1.5 block text-[13px] font-medium text-fg-2"}>
        {label}
      </label>
      <div
        className={`flex h-11 items-center gap-2 rounded-control border bg-surface-2 px-3 transition-[border-color,box-shadow] focus-within:border-[color:var(--d-ink)] focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--d-ink)_22%,transparent)] ${
          error ? "border-danger shadow-[0_0_0_3px_color-mix(in_oklab,var(--danger)_16%,transparent)]" : focused ? "border-[color:var(--d-ink)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--d-ink)_22%,transparent)]" : "border-line-strong"
        } ${props.disabled ? "opacity-50" : ""}`}
      >
        {prefix}
        <input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`h-full min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-3 disabled:cursor-not-allowed ${inputClassName}`}
          {...props}
        />
        {suffix}
      </div>
      {error ? (
        <p id={`${fieldId}-error`} className="mt-1.5 flex items-center gap-1.5 text-[13px] text-danger">
          <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="mt-1.5 text-[13px] text-fg-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
