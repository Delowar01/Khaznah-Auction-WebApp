// SVG countdown ring. The arc shows the share of the auction window still to
// run and depletes as the clock ticks; colour follows urgency. Rings are
// clock-like, so they keep the same (clockwise) direction in Arabic.

const STROKE = {
  ink: "stroke-[var(--d-ink)]",
  warning: "stroke-warning",
  danger: "stroke-live",
  upcoming: "stroke-[var(--d-ink)]",
  muted: "stroke-fg-3",
  gold: "stroke-accent",
};

const HEAD = {
  ink: "fill-[var(--d-ink)]",
  warning: "fill-warning",
  danger: "fill-live",
  upcoming: "fill-[var(--d-ink)]",
  muted: "fill-fg-3",
  gold: "fill-accent",
};

export function CountdownRing({ fraction = 1, size = 56, stroke = 4, tone = "ink", head = false, className = "", children }) {
  const r = (size - stroke) / 2 - (head ? 2 : 0);
  const c = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, fraction));
  const visible = clamped <= 0 ? 0 : Math.max(clamped, 0.012);
  const offset = c * (1 - visible);
  const angle = visible * 2 * Math.PI;
  const center = size / 2;
  const hx = center + r * Math.cos(angle);
  const hy = center + r * Math.sin(angle);

  return (
    <div className={`relative grid shrink-0 place-items-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx={center} cy={center} r={r} fill="none" strokeWidth={stroke} className="stroke-[var(--d-track)]" />
        {tone === "upcoming" ? (
          <circle cx={center} cy={center} r={r} fill="none" strokeWidth={stroke} strokeDasharray="2 5" className="stroke-[var(--d-ink)] opacity-35" />
        ) : null}
        {visible > 0 ? (
          <circle
            cx={center}
            cy={center}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className={`d-ring-arc ${STROKE[tone] || STROKE.ink}`}
          />
        ) : null}
        {head && visible > 0 ? <circle cx={hx} cy={hy} r={stroke * 0.95 + 1.5} className={`${HEAD[tone] || HEAD.ink}`} /> : null}
      </svg>
      <div className="relative flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}
