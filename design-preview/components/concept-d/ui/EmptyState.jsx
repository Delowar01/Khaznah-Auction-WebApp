// Empty state with a sonar/radar mark drawn from CSS circles.

export function Radar({ className = "" }) {
  return (
    <div aria-hidden="true" className={`relative size-40 ${className}`}>
      {[1, 0.74, 0.48, 0.22].map((scale) => (
        <span
          key={scale}
          className="absolute inset-0 m-auto rounded-full border border-[color:var(--d-ink)]/25"
          style={{ width: `${scale * 100}%`, height: `${scale * 100}%` }}
        />
      ))}
      <span className="absolute inset-x-0 top-1/2 h-px bg-[var(--d-ink)]/15" />
      <span className="absolute inset-y-0 start-1/2 w-px bg-[var(--d-ink)]/15" />
      <span
        className="d-sweep absolute inset-0 rounded-full"
        style={{ background: "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--d-ink) 38%, transparent) 50deg, transparent 52deg)" }}
      />
      <span className="absolute start-[28%] top-[30%] size-1.5 rounded-full bg-[var(--d-ink)]/50" />
      <span className="absolute end-[24%] top-[58%] size-1 rounded-full bg-[var(--d-ink)]/40" />
      <span className="absolute inset-0 m-auto size-2.5 rounded-full bg-[var(--d-ink)] shadow-[0_0_0_6px_color-mix(in_oklab,var(--d-ink)_18%,transparent)]" />
    </div>
  );
}

export function EmptyState({ title, text, children, className = "", headingLevel = 2 }) {
  const Heading = `h${headingLevel}`;
  return (
    <div className={`d-panel flex flex-col items-center px-6 py-14 text-center ${className}`}>
      <Radar />
      <Heading className="mt-6 text-lg font-semibold text-fg">{title}</Heading>
      {text ? <p className="mt-2 max-w-md text-sm text-fg-2 text-pretty">{text}</p> : null}
      {children ? <div className="mt-6 flex flex-wrap items-center justify-center gap-2">{children}</div> : null}
    </div>
  );
}
