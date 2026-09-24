// Tiny price sparkline for cards (decorative; the figures sit beside it).

export function Sparkline({ values = [], width = 72, height = 24, tone = "ink", className = "" }) {
  if (values.length < 2) return <span aria-hidden="true" className={`inline-block ${className}`} style={{ width, height }} />;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = (width - 4) / (values.length - 1);
  const pts = values.map((v, i) => [2 + i * step, 3 + (1 - (v - min) / span) * (height - 6)]);
  const d = pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join("");
  const [lx, ly] = pts[pts.length - 1];
  const color = tone === "gold" ? "var(--accent)" : tone === "danger" ? "var(--live)" : tone === "warning" ? "var(--warning)" : "var(--d-chart)";
  return (
    <svg aria-hidden="true" width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={`shrink-0 overflow-visible ${className}`} dir="ltr">
      <path d={d} fill="none" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" style={{ stroke: color }} />
      <circle cx={lx} cy={ly} r="2.5" style={{ fill: color }} />
    </svg>
  );
}
