"use client";

import { useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { GradeChip } from "./GradeChip";

/**
 * Stacked bar of units per manifest line. One series, so one hue; lines are
 * separated by a 2px surface gap and labelled in place when a segment is
 * wide enough. Hovering a segment or a legend row highlights its partner.
 */
export function ManifestBar({ lines, label, legend = true, legendLimit, height = "h-6", className = "" }) {
  const { t } = useLang();
  const [active, setActive] = useState(null);
  const total = lines.reduce((sum, line) => sum + line.qty, 0);
  const shown = legendLimit ? lines.slice(0, legendLimit) : lines;
  const summary = `${label}: ${lines.map((line) => `${t(line.name)} ${line.qty}`).join(", ")}`;

  return (
    <div className={className}>
      <div role="img" aria-label={summary} className={`flex gap-[2px] ${height}`}>
        {lines.map((line, index) => {
          const share = line.qty / total;
          return (
            <span
              key={line.key}
              onPointerEnter={() => setActive(index)}
              onPointerLeave={() => setActive(null)}
              title={`${t(line.name)} · ${line.qty}`}
              className={`grid min-w-[6px] place-items-center overflow-hidden rounded-[2px] bg-[var(--d-chart)] transition-opacity first:rounded-s-[5px] last:rounded-e-[5px] ${active != null && active !== index ? "opacity-40" : ""}`}
              style={{ flexGrow: line.qty, flexBasis: 0 }}
            >
              {share >= 0.09 ? <span className="d-num text-[10.5px] font-semibold text-[var(--surface)]">{line.qty}</span> : null}
            </span>
          );
        })}
      </div>
      {legend ? (
        <ol className="mt-3 grid gap-x-5 gap-y-1 sm:grid-cols-2">
          {shown.map((line) => {
            const index = lines.indexOf(line);
            return (
              <li
                key={line.key}
                onPointerEnter={() => setActive(index)}
                onPointerLeave={() => setActive(null)}
                className={`flex min-w-0 items-center gap-2 rounded-md px-1 py-0.5 text-xs transition-colors ${active === index ? "bg-surface-2" : ""}`}
              >
                <span className="d-num w-4 shrink-0 text-[10.5px] text-fg-3">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1 truncate text-fg-2">{t(line.name)}</span>
                <GradeChip grade={line.grade} size="sm" />
                <span className="d-num w-7 shrink-0 text-end font-medium text-fg">{line.qty}</span>
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}

/** A strip of unit cells for cartons/cases (e.g. 24 bags, 5 stands). */
export function UnitStrip({ units, className = "" }) {
  return (
    <div aria-hidden="true" className={`flex flex-wrap gap-[3px] ${className}`}>
      {Array.from({ length: units }, (_, i) => (
        <span key={i} className="size-2.5 rounded-[2px] bg-[var(--d-chart)] opacity-80" />
      ))}
    </div>
  );
}
