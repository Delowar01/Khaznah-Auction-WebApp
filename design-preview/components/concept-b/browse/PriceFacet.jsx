"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { PriceRange } from "@/components/shared/ui/PriceRange";
import { RIYAL } from "@/lib/format";
import { PRICE_BOUNDS } from "@/lib/useBrowse";

const STEP = 50;

function PriceInput({ label, value, onCommit }) {
  const [draft, setDraft] = useState(String(value));
  const [seen, setSeen] = useState(value);
  if (value !== seen) {
    setSeen(value);
    setDraft(String(value));
  }
  const commit = () => {
    const n = Number(draft);
    if (Number.isFinite(n)) onCommit(n);
    else setDraft(String(value));
  };
  return (
    <label className="flex h-10 min-w-0 flex-1 items-center rounded-control border border-line-strong bg-surface px-2.5 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="me-1.5 kb-xs font-bold text-fg-3">
        {RIYAL}
      </span>
      <input
        type="number"
        inputMode="numeric"
        dir="ltr"
        min={PRICE_BOUNDS[0]}
        max={PRICE_BOUNDS[1]}
        step={STEP}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") commit();
        }}
        className="kb-no-spin w-full min-w-0 bg-transparent kb-sm font-semibold tabular text-fg outline-none"
      />
    </label>
  );
}

/** Dual-thumb slider plus min / max inputs; slider changes settle before filtering. */
export function PriceFacet({ value, onChange }) {
  const { ui } = useLang();
  const [draft, setDraft] = useState(value);
  const [seen, setSeen] = useState(value);
  const timer = useRef(null);

  if (value[0] !== seen[0] || value[1] !== seen[1]) {
    setSeen(value);
    setDraft(value);
  }

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onSlide = (next) => {
    setDraft(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onChange(next), 350);
  };

  const commit = (index) => (n) => {
    const clamped = Math.min(PRICE_BOUNDS[1], Math.max(PRICE_BOUNDS[0], Math.round(n / STEP) * STEP));
    const next = index === 0 ? [Math.min(clamped, draft[1] - STEP), draft[1]] : [draft[0], Math.max(clamped, draft[0] + STEP)];
    setDraft(next);
    onChange(next);
  };

  return (
    <div className="px-1.5 pb-1">
      <PriceRange min={PRICE_BOUNDS[0]} max={PRICE_BOUNDS[1]} step={STEP} value={draft} onChange={onSlide} />
      <div className="mt-3 flex items-center gap-2">
        <PriceInput label={ui("min")} value={draft[0]} onCommit={commit(0)} />
        <span aria-hidden="true" className="text-fg-3">
          –
        </span>
        <PriceInput label={ui("max")} value={draft[1]} onCommit={commit(1)} />
      </div>
    </div>
  );
}
