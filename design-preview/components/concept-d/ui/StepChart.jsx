"use client";

// Bid-price step chart (oldest → newest). Price moves in discrete bid steps,
// so a step line reads truer than a smooth curve. Time runs left → right in
// both languages (the financial-chart convention), like the figures it plots.
// Hover shows a crosshair + tooltip; the bid-history table is the full
// text equivalent, so the tooltip only ever enhances.
import { useId, useState } from "react";
import { Money } from "@/components/shared/ui/Money";
import { useMeasure } from "../lib/hooks";

export function StepChart({ points = [], height = 96, label, axis = true, tooltip, className = "" }) {
  const [ref, width] = useMeasure(320);
  const [hover, setHover] = useState(null);
  const gid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const pad = { t: 10, b: 8, l: 2, r: axis ? 10 : 12 };

  if (!points.length) {
    return (
      <div ref={ref} className={`relative grid place-items-center rounded-lg border border-dashed border-line text-xs text-fg-3 ${className}`} style={{ height }}>
        <span className="px-4 text-center">{label}</span>
      </div>
    );
  }

  const amounts = points.map((p) => p.amount);
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  const span = max - min || Math.max(1, max * 0.08);
  const lo = min - span * 0.18;
  const hi = max + span * 0.14;
  const n = points.length;
  const innerW = Math.max(10, width - pad.l - pad.r);
  const innerH = height - pad.t - pad.b;
  const x = (i) => pad.l + (n <= 1 ? innerW : (i / (n - 1)) * innerW);
  const y = (v) => pad.t + (1 - (v - lo) / (hi - lo)) * innerH;

  let line = "";
  points.forEach((p, i) => {
    line += i === 0 ? `M${x(0).toFixed(1)},${y(p.amount).toFixed(1)}` : `H${x(i).toFixed(1)}V${y(p.amount).toFixed(1)}`;
  });
  if (n === 1) line += `H${(pad.l + innerW).toFixed(1)}`;
  const area = `${line}V${(height - pad.b).toFixed(1)}H${x(0).toFixed(1)}Z`;
  const lastX = n === 1 ? pad.l + innerW : x(n - 1);
  const last = points[n - 1];
  const gridYs = [0.2, 0.55, 0.9].map((f) => pad.t + f * innerH);

  const onMove = (event) => {
    if (!tooltip || n < 2) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const i = Math.round(((event.clientX - rect.left - pad.l) / innerW) * (n - 1));
    setHover(Math.min(n - 1, Math.max(0, i)));
  };

  const hovered = hover != null ? points[hover] : null;
  const hx = hover != null ? x(hover) : 0;

  return (
    <div ref={ref} className={`relative ${className}`} dir="ltr">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
        className="block touch-pan-y overflow-visible"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={`g${gid}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--d-chart)", stopOpacity: 0.16 }} />
            <stop offset="100%" style={{ stopColor: "var(--d-chart)", stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        {gridYs.map((gy) => (
          <line key={gy} x1={pad.l} x2={width - pad.r} y1={gy} y2={gy} strokeWidth="1" style={{ stroke: "var(--border)" }} />
        ))}
        <path d={area} fill={`url(#g${gid})`} />
        <path d={line} fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" style={{ stroke: "var(--d-chart)" }} />
        {points.map((p, i) =>
          p.own && i !== n - 1 ? <circle key={p.id || i} cx={x(i)} cy={y(p.amount)} r="4" strokeWidth="2" className="fill-accent" style={{ stroke: "var(--surface)" }} /> : null,
        )}
        <circle cx={lastX} cy={y(last.amount)} r="10" className={`d-halo ${last.own ? "fill-accent/30" : "fill-[var(--d-chart)]/25"}`} />
        <circle cx={lastX} cy={y(last.amount)} r="4.5" strokeWidth="2" className={last.own ? "fill-accent" : "fill-[var(--d-chart)]"} style={{ stroke: "var(--surface)" }} />
        {hovered ? (
          <g aria-hidden="true">
            <line x1={hx} x2={hx} y1={pad.t - 4} y2={height - pad.b} strokeWidth="1" style={{ stroke: "var(--border-strong)" }} />
            <circle cx={hx} cy={y(hovered.amount)} r="4.5" strokeWidth="2" className={hovered.own ? "fill-accent" : "fill-[var(--d-chart)]"} style={{ stroke: "var(--surface)" }} />
          </g>
        ) : null}
      </svg>

      {axis ? (
        <>
          <span aria-hidden="true" className="d-num pointer-events-none absolute end-0 top-0 rounded bg-surface/85 px-1 text-[10px] text-fg-3">
            <Money value={max} />
          </span>
          <span aria-hidden="true" className="d-num pointer-events-none absolute bottom-0 end-0 rounded bg-surface/85 px-1 text-[10px] text-fg-3">
            <Money value={min} />
          </span>
        </>
      ) : null}

      {hovered && tooltip ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 z-10 -translate-y-[calc(100%+6px)] whitespace-nowrap rounded-lg border border-line-strong bg-elevated px-2.5 py-1.5 text-xs shadow-raised"
          style={{ left: Math.min(Math.max(hx - 70, 0), Math.max(0, width - 150)) }}
        >
          {tooltip(hovered)}
        </div>
      ) : null}
    </div>
  );
}
