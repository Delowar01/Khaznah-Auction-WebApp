"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { UI } from "@/data/ui";
import { COPY } from "../copy";
import { BiHeading } from "../ui/Bi";
import { Breadcrumbs } from "../ui/Misc";

const TITLE = { all: UI.allLots, auction: UI.auctions, buy_now: UI.buyNow };

/** Search within results; applies after a short pause so skeletons don't flicker per keystroke. */
export function SearchField({ value, onSearch, label, placeholder, className = "", inputClassName = "" }) {
  const { ui } = useLang();
  const id = useId();
  const [text, setText] = useState(value);
  const timer = useRef(null);

  useEffect(() => {
    // Keep the field in step when the search is changed elsewhere (chips, header search).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setText(value);
  }, [value]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const change = (next) => {
    setText(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onSearch(next.trim()), 350);
  };

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        window.clearTimeout(timer.current);
        onSearch(text.trim());
      }}
      className={`relative ${className}`}
    >
      <label htmlFor={id} className="sr-only">
        {label || ui("search")}
      </label>
      <Search aria-hidden="true" className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-fg-3" />
      <input id={id} type="search" value={text} onChange={(e) => change(e.target.value)} placeholder={placeholder || ui("searchPlaceholder")} className={`c-input h-13 ps-12 pe-12 ${inputClassName}`} />
      {text ? (
        <button type="button" onClick={() => change("")} aria-label={ui("clearFilters")} className="absolute end-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-sm text-fg-3 hover:bg-surface-2 hover:text-fg">
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </form>
  );
}

/** "30 results" with the figure set large; phrases without a figure ("نتيجتان") stay whole. */
export function ResultCount({ text, className = "" }) {
  const match = text.match(/^([\d,]+)\s*(.*)$/);
  return (
    <p className={`flex items-baseline gap-2 text-fg-2 ${className}`} aria-live="polite">
      {match ? (
        <>
          <span className="c-num text-[2rem] font-semibold leading-none text-fg">{match[1]}</span>
          <span className="text-sm">{match[2]}</span>
        </>
      ) : (
        <span className="text-lg font-semibold text-fg">{text}</span>
      )}
    </p>
  );
}

/** Page head: breadcrumb, bilingual title for the active tab, count and search, on a hairline grid. */
export function BrowseHead({ browse }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const title = TITLE[browse.state.tab] || UI.allLots;

  return (
    <section className="relative overflow-hidden border-b border-line">
      <span className="c-gridlines" style={{ "--grid": "4rem", "--grid-mask": "linear-gradient(to bottom, black, transparent 95%)" }} />
      <div className="c-container relative pb-8 pt-8 lg:pb-10 lg:pt-12">
        <Breadcrumbs items={[{ label: ui("home"), href: link("/") }, { label: ui("browse") }]} />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="max-w-2xl">
            <BiHeading as="h1" size="display" content={title} titleClassName="text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem]" />
            <p className="c-prose mt-4">{t(COPY.browseLead)}</p>
          </div>
          <ResultCount text={pl("results", browse.total)} />
        </div>
        <SearchField value={browse.state.search} onSearch={browse.setSearch} className="mt-8 max-w-2xl" />
      </div>
    </section>
  );
}
