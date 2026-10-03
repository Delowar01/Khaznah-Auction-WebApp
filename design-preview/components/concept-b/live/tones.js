// Colours for the call on the current lot (Option 1). On the navy console
// head each digit colour clears 4.5:1; on light surfaces the chips use the
// fixed plate tags. The call is always written out as well.
export const CALL_DIGITS = {
  calm: "text-white",
  warn: "text-[#fdb022]",
  final: "text-[#ff8a80]",
  paused: "text-white/70",
};

export const CALL_DOT = {
  calm: "bg-[#47cd89]",
  warn: "bg-[#fdb022]",
  final: "bg-[#ff8a80]",
  paused: "bg-white/55",
};

export const CALL_CHIP = {
  calm: "bg-success/10 text-success ring-1 ring-inset ring-success/25",
  warn: "kb-tag-warn",
  final: "kb-tag-live",
  paused: "bg-surface-2 text-fg-2 ring-1 ring-inset ring-line",
};

export const CALL_BAR = {
  calm: "bg-primary",
  warn: "bg-warning",
  final: "bg-live",
  paused: "bg-line-strong",
};

// Buttons that stay focusable while the next lot waits (aria-disabled).
export const UNAVAILABLE = "aria-disabled:cursor-not-allowed aria-disabled:bg-muted aria-disabled:text-fg-3 aria-disabled:shadow-none aria-disabled:active:translate-y-0";
