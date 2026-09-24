"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Modal } from "@/components/shared/ui/Modal";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { POPULAR_SEARCHES } from "@/lib/catalog";
import { Kbd } from "../ui/Layout";
import { Radar } from "../ui/EmptyState";
import { useCopy } from "../lib/useCopy";
import { useChrome } from "./ChromeContext";
import { usePaletteResults } from "./usePaletteResults";
import { PaletteOption } from "./PaletteOption";

const GROUP_LABEL = { closing: "paletteClosing", lots: "paletteLots", categories: "paletteCategories", sellers: "paletteSellers" };

function PaletteBody({ onClose }) {
  const router = useRouter();
  const { link } = useConcept();
  const { lang, t, ui } = useLang();
  const c = useCopy();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const { groups, flat, empty } = usePaletteResults(query, lang, link);
  const current = flat[Math.min(active, flat.length - 1)];

  useEffect(() => {
    if (current) document.getElementById(current.id)?.scrollIntoView({ block: "nearest" });
  }, [current]);

  const go = (item) => {
    if (!item) return;
    onClose();
    router.push(item.href);
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % Math.max(1, flat.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + flat.length) % Math.max(1, flat.length));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(current);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search aria-hidden="true" className="size-5 shrink-0 text-fg-2" />
        <input
          data-autofocus
          data-testid="search-input"
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={current?.id}
          aria-autocomplete="list"
          aria-label={c("paletteTitle")}
          placeholder={c("commandSearch")}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          className="h-16 min-w-0 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-fg-3"
        />
        <button type="button" onClick={onClose} aria-label={ui("close")} className="grid size-10 place-items-center rounded-lg text-fg-3 hover:bg-surface-2 hover:text-fg md:hidden">
          <X aria-hidden="true" className="size-5" />
        </button>
        <span className="hidden md:inline-flex">
          <Kbd>esc</Kbd>
        </span>
      </div>

      <div className="d-scroll min-h-0 flex-1 overflow-y-auto p-2 md:max-h-[min(60vh,520px)]">
        {!query.trim() ? (
          <div className="px-2 pb-2 pt-2">
            <p className="d-label mb-2 text-fg-3">{ui("popularSearches")}</p>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term.en}
                  type="button"
                  onClick={() => setQuery(t(term))}
                  className="h-8 rounded-full border border-line-strong bg-surface-2 px-3 text-[13px] text-fg-2 transition-colors hover:text-fg"
                >
                  {t(term)}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {empty ? (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <Radar className="size-24" />
            <p className="mt-5 font-medium text-fg">{c("paletteNoResults", { q: query.trim() })}</p>
            <p className="mt-1 max-w-sm text-sm text-fg-2">{c("paletteNoResultsText")}</p>
          </div>
        ) : null}

        <div id={listId} role="listbox" aria-label={c("paletteTitle")}>
          {groups.map((group) => {
            const headingId = `${listId}-${group.key}`;
            return (
              <div key={group.key} role="presentation" className="pt-2">
                {GROUP_LABEL[group.key] ? (
                  <p id={headingId} aria-hidden="true" className="d-label px-3 pb-1.5 pt-2 text-fg-3">
                    {c(GROUP_LABEL[group.key])}
                  </p>
                ) : null}
                <div role="group" aria-labelledby={GROUP_LABEL[group.key] ? headingId : undefined} aria-label={GROUP_LABEL[group.key] ? undefined : ui("search")}>
                  {group.items.map((item) => {
                    const index = flat.indexOf(item);
                    return (
                      <PaletteOption
                        key={item.id}
                        item={item}
                        query={query}
                        active={current?.id === item.id}
                        onHover={() => setActive(index)}
                        onPick={() => onClose()}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="hidden items-center gap-4 border-t border-line px-4 py-2.5 text-xs text-fg-3 md:flex">
        <span className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          {c("paletteNavigate")}
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↵</Kbd>
          {c("paletteOpen")}
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>esc</Kbd>
          {c("paletteClose")}
        </span>
      </div>
    </div>
  );
}

/** ⌘K command palette: lots (live price + time), categories and sellers. */
export function CommandPalette() {
  const { paletteOpen, closePalette } = useChrome();
  const c = useCopy();
  return (
    <Modal
      open={paletteOpen}
      onClose={closePalette}
      title={c("paletteTitle")}
      initialFocus="[data-autofocus]"
      panelClassName="max-w-[640px] overflow-hidden bg-elevated shadow-overlay max-md:h-[calc(100dvh-var(--pbar-h))] max-md:max-h-[calc(100dvh-var(--pbar-h))] md:mb-[18vh] md:self-center md:rounded-2xl md:border md:border-line-strong"
    >
      <PaletteBody onClose={closePalette} />
    </Modal>
  );
}
