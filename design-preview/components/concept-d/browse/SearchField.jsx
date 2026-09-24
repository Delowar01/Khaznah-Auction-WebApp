"use client";

import { useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";

/**
 * In-page search bound to useBrowse().setSearch, debounced so the result
 * skeleton doesn't flash on every keystroke. External changes (a removed
 * chip, a palette link) flow back into the field.
 */
export function SearchField({ value, onSearch, placeholder, label, className = "" }) {
  const { ui } = useLang();
  const [text, setText] = useState(value);
  const [external, setExternal] = useState(value);
  const timer = useRef(0);

  if (value !== external) {
    setExternal(value);
    setText(value);
  }

  const push = (next, delay = 280) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onSearch(next), delay);
  };

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        push(text, 0);
      }}
      className={`flex h-12 items-center gap-2.5 rounded-control border border-line-strong bg-surface-2/80 ps-3.5 pe-1.5 transition-[border-color,box-shadow] focus-within:border-[color:var(--d-ink)] focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--d-ink)_22%,transparent)] ${className}`}
    >
      <Search aria-hidden="true" className="size-4 shrink-0 text-fg-2" />
      <label className="min-w-0 flex-1">
        <span className="sr-only">{label}</span>
        <input
          type="search"
          value={text}
          placeholder={placeholder}
          onChange={(e) => {
            setText(e.target.value);
            push(e.target.value);
          }}
          className="h-10 w-full bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-3 [&::-webkit-search-cancel-button]:hidden"
        />
      </label>
      {text ? (
        <button
          type="button"
          onClick={() => {
            setText("");
            push("", 0);
          }}
          aria-label={ui("clearFilters")}
          className="grid size-9 place-items-center rounded-lg text-fg-3 hover:bg-surface hover:text-fg"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </form>
  );
}
