import { Check } from "lucide-react";

/** Native checkbox with a custom square face (keeps keyboard + screen-reader behaviour). */
export function Checkbox({ checked, onChange, children, count, disabled = false }) {
  return (
    <label className={`group flex min-h-10 cursor-pointer items-center gap-3 text-[14px] ${disabled ? "cursor-not-allowed text-fg-3" : "text-fg"}`}>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} disabled={disabled} />
      <span
        aria-hidden="true"
        className="grid size-[18px] shrink-0 place-items-center rounded-xs border border-line-strong bg-surface text-on-secondary transition-colors group-hover:border-fg peer-checked:border-secondary peer-checked:bg-secondary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus"
      >
        {checked ? <Check className="size-3" strokeWidth={3} /> : null}
      </span>
      <span className="flex-1">{children}</span>
      {count != null ? <span className="text-[12px] text-fg-3 tabular">{count}</span> : null}
    </label>
  );
}
