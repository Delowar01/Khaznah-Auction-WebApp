// Thin time-left / progress bar. Fills from the inline start, so it follows
// the reading direction in Arabic.

const FILL = {
  ink: "bg-[var(--d-ink)]",
  warning: "bg-warning",
  danger: "bg-live",
  upcoming: "bg-[var(--d-ink)] opacity-60",
  muted: "bg-fg-3/50",
  gold: "bg-accent",
  success: "bg-success",
};

export function TimeBar({ fraction = 0, tone = "ink", className = "", thickness = "h-[3px]", glow = false }) {
  const pct = Math.min(1, Math.max(0, fraction)) * 100;
  return (
    <div aria-hidden="true" className={`relative w-full overflow-hidden rounded-full bg-[var(--d-track)] ${thickness} ${className}`}>
      <div
        className={`d-bar-fill absolute inset-y-0 start-0 rounded-full ${FILL[tone] || FILL.ink} ${glow ? "shadow-[0_0_12px_currentColor]" : ""}`}
        style={{ inlineSize: `${pct}%` }}
      />
    </div>
  );
}
