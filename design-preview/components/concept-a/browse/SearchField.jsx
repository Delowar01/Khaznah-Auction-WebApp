"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";

/** Search input that commits after the user pauses typing (like production's 350 ms debounce). */
export function SearchField({ value, onCommit, className = "", inputClassName = "" }) {
  const { ui } = useLang();
  const [draft, setDraft] = useState(value);
  const timer = useRef(null);

  useEffect(() => {
    // Keep the field in sync when filters are cleared elsewhere.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(value);
  }, [value]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{ui("search")}</span>
      <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-fg-3" />
      <input
        type="search"
        value={draft}
        onChange={(e) => {
          const next = e.target.value;
          setDraft(next);
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => onCommit(next), 350);
        }}
        placeholder={ui("search")}
        className={`w-full rounded-control border border-line-strong bg-surface ps-10 pe-3 text-sm text-fg outline-none placeholder:text-fg-3 focus:border-fg ${inputClassName}`}
      />
    </label>
  );
}
