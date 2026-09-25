"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "../ui/cx";

/** Collapsible facet section with an active-count badge. */
export function FacetGroup({ title, active = 0, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-line py-3 last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-9 w-full items-center gap-2 rounded-md px-1.5 text-start kb-sm font-bold text-fg transition-colors hover:bg-surface-2"
        >
          <span className="flex-1">{title}</span>
          {active ? <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 kb-2xs font-bold text-on-primary tabular">{active}</span> : null}
          <ChevronDown aria-hidden="true" className={cx("size-4 text-fg-3 transition-transform duration-200", open && "rotate-180")} />
        </button>
      </h3>
      <div id={id} hidden={!open} className="pt-1.5">
        {children}
      </div>
    </div>
  );
}
