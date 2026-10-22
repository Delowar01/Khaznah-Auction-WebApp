"use client";

// Option 3 form controls: rounded fields on white with a blue-grey border
// that turns indigo on focus and red when invalid, labels above, hints and
// errors below (wired with aria-describedby), pill choices and radio cards.
// Email, phone, number and code fields stay left-to-right in Arabic (as in
// production), aligned to the Arabic reading edge.
import { useId, useState } from "react";
import { ChevronDown, Eye, EyeOff, Check } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { cx } from "../ui";

const TEXT = {
  optional: { en: "Optional", ar: "اختياري" },
  show: { en: "Show password", ar: "إظهار كلمة المرور" },
  hide: { en: "Hide password", ar: "إخفاء كلمة المرور" },
};

export const fieldClass = (invalid) =>
  cx(
    "w-full rounded-[14px] border bg-white px-4 vd-md text-[var(--vd-ink)] outline-none transition-[border-color,box-shadow] placeholder:text-[#66769c] focus-visible:border-[var(--vd-indigo)] focus-visible:shadow-[0_0_0_3px_rgb(24_57_151/0.18)] disabled:cursor-not-allowed disabled:bg-[#f6f8fc] disabled:text-[var(--vd-muted)]",
    invalid ? "border-[#d92623]" : "border-[#cfdaea] hover:border-[#b6c6df]",
  );

/**
 * Label, control, hint and error. `children` receives the ids to put on the
 * control: ({ id, describedBy, invalid }).
 */
export function Field({ label, hint, error, optional = false, className = "", children, labelHidden = false }) {
  const { t } = useLang();
  const id = useId();
  const hintId = hint ? `${id}-hint` : null;
  const errorId = error ? `${id}-error` : null;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cx("grid gap-1.5", className)}>
      <label htmlFor={id} className={cx("flex items-baseline justify-between gap-3 vd-md font-semibold text-[var(--vd-ink)]", labelHidden && "sr-only")}>
        {label}
        {optional ? <span className="vd-xs font-normal text-[var(--vd-muted)]">{t(TEXT.optional)}</span> : null}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint ? (
        <p id={hintId} className="vd-xs text-[var(--vd-muted)]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="vd-sm font-semibold text-[#b3261e]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const LTR_TYPES = new Set(["email", "tel", "number", "url"]);

export function TextInput({ id, describedBy, invalid, type = "text", className = "", ltr, ...rest }) {
  const forceLtr = ltr ?? LTR_TYPES.has(type);
  return (
    <input
      id={id}
      type={type}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      dir={forceLtr ? "ltr" : undefined}
      className={cx(fieldClass(invalid), "h-12", forceLtr && "rtl:text-right", type === "number" && "vd-no-spin tabular", className)}
      {...rest}
    />
  );
}

export function TextArea({ id, describedBy, invalid, className = "", rows = 4, ...rest }) {
  return <textarea id={id} rows={rows} aria-describedby={describedBy} aria-invalid={invalid || undefined} className={cx(fieldClass(invalid), "min-h-28 py-3 leading-[1.5]", className)} {...rest} />;
}

/** Native select (keyboard and screen readers get the platform list) with a pill chevron. */
export function Select({ id, describedBy, invalid, className = "", children, ...rest }) {
  return (
    <span className="relative block">
      <select id={id} aria-describedby={describedBy} aria-invalid={invalid || undefined} className={cx(fieldClass(invalid), "h-12 appearance-none pe-11", className)} {...rest}>
        {children}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-[var(--vd-indigo)]" strokeWidth={2.2} />
    </span>
  );
}

/**
 * Password with a show / hide eye button inside the field. Optional: `shown`
 * and `onShownChange` to share one toggle between two fields (the other
 * field passes `toggle={false}`), `labels` ({ show, hide }) to name the
 * toggle when a form has two.
 */
export function PasswordInput({ id, describedBy, invalid, className = "", shown: shownProp, onShownChange, toggle = true, labels, disabled, ...rest }) {
  const { t } = useLang();
  const [shownState, setShownState] = useState(false);
  const shown = shownProp ?? shownState;
  const flip = () => {
    if (shownProp === undefined) setShownState(!shown);
    onShownChange?.(!shown);
  };
  return (
    <span className="relative block">
      <input
        id={id}
        type={shown ? "text" : "password"}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        dir="ltr"
        disabled={disabled}
        className={cx(fieldClass(invalid), "h-12 rtl:text-right", toggle && "pe-14", className)}
        {...rest}
      />
      {toggle ? (
        <button
          type="button"
          onClick={flip}
          disabled={disabled}
          aria-pressed={shown}
          aria-label={labels ? (shown ? labels.hide : labels.show) : t(shown ? TEXT.hide : TEXT.show)}
          className="absolute end-1.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-[var(--vd-indigo)] hover:bg-[var(--vd-bluegray)] disabled:opacity-45"
        >
          {shown ? <EyeOff aria-hidden="true" className="size-[18px]" strokeWidth={2} /> : <Eye aria-hidden="true" className="size-[18px]" strokeWidth={2} />}
        </button>
      ) : null}
    </span>
  );
}

/** Six-digit code: one numeric field, spaced, filled from SMS/email autofill. */
export function CodeInput({ id, describedBy, invalid, className = "", length = 6, ...rest }) {
  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={length}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      dir="ltr"
      className={cx(fieldClass(invalid), "h-14 text-center text-[24px] font-extrabold tracking-[0.5em] tabular placeholder:tracking-[0.5em]", className)}
      {...rest}
    />
  );
}

/** Checkbox with its label; the box is a rounded square that fills indigo. */
export function Checkbox({ checked, onChange, children, className = "", invalid = false, describedBy, ...rest }) {
  return (
    <label className={cx("flex cursor-pointer items-start gap-3 vd-md text-[var(--vd-ink)]", className)}>
      <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cx("peer size-5 cursor-pointer appearance-none rounded-[6px] border-[1.5px] bg-white checked:border-[var(--vd-indigo)] checked:bg-[var(--vd-indigo)]", invalid ? "border-[#d92623]" : "border-[#9fb0cf]")}
          {...rest}
        />
        <Check aria-hidden="true" className="pointer-events-none absolute size-3.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
      </span>
      <span className="min-w-0">{children}</span>
    </label>
  );
}

/**
 * A choice drawn as a card: the radio is visually hidden and the card shows
 * the selection (indigo ring and dot). Keyboard and screen readers use the
 * native radio group.
 */
export function RadioCard({ name, value, checked, onChange, disabled = false, children, className = "", aside }) {
  return (
    <label className={cx("relative flex gap-3 rounded-[18px] border bg-white p-4 transition-[border-color,box-shadow]", disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer hover:border-[#b6c6df]", checked ? "border-[var(--vd-indigo)] shadow-[0_0_0_1px_var(--vd-indigo)]" : "border-[#dfe7f3]", className)}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} disabled={disabled} className="peer sr-only" />
      <span aria-hidden="true" className={cx("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-[1.5px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]", checked ? "border-[var(--vd-indigo)]" : "border-[#9fb0cf]")}>
        {checked ? <span className="size-2.5 rounded-full bg-[var(--vd-indigo)]" /> : null}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
      {aside ? <span className="shrink-0">{aside}</span> : null}
    </label>
  );
}

/** Pill segmented choice (two or three options) on the blue-grey track of Browse. */
export function PillChoice({ legend, name, value, onChange, options, className = "" }) {
  return (
    <fieldset className={cx("min-w-0", className)}>
      <legend className="sr-only">{legend}</legend>
      <div className="grid gap-1 rounded-full bg-[var(--vd-bluegray)] p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <label key={option.value} className={cx("min-w-0", option.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer")}>
              <input type="radio" name={name} value={option.value} checked={checked} disabled={option.disabled} onChange={() => onChange(option.value)} className="peer sr-only" />
              <span className={cx("flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-3 vd-md transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]", checked ? "bg-[var(--vd-indigo)] font-semibold text-white" : "text-[var(--vd-ink)] hover:bg-white/70")}>
                {option.icon ? <option.icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.1} /> : null}
                <span className="truncate">{option.label}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
