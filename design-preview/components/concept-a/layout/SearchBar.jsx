"use client";

import { useCallback, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Listbox } from "@/components/shared/ui/Listbox";
import { useDismiss } from "@/components/shared/ui/hooks";
import { CATEGORIES } from "@/data/categories";
import { detailPath } from "@/lib/catalog";
import { cx } from "../ui/cx";
import { useBrowseNavigate } from "../utils/navigation";
import { COPY } from "../copy";
import { useChrome } from "./ChromeContext";
import { SearchSuggest } from "./SearchSuggest";
import { useSuggestions } from "./useSuggestions";

function ScopeSelect({ value, onChange }) {
  const { t, ui } = useLang();
  const options = [{ value: "all", label: ui("allCategories") }, ...CATEGORIES.map((c) => ({ value: c.slug, label: t(c.name) }))];
  return (
    <Listbox
      value={value}
      onChange={onChange}
      options={options}
      label={t(COPY.searchScope)}
      align="start"
      className="hidden h-full shrink-0 lg:block"
      buttonClassName="flex h-full max-w-[12rem] items-center gap-1.5 rounded-s-full border-e border-line bg-surface-2/70 ps-5 pe-3 kb-sm font-semibold text-fg-2 transition-colors hover:text-fg"
      renderButton={(current) => <span className="truncate">{current?.label}</span>}
      menuClassName="kb-focus-reset max-h-80 w-60 overflow-y-auto rounded-xl border border-line bg-elevated p-1.5 shadow-overlay"
      optionClassName="rounded-lg px-3 py-2 kb-sm text-fg"
      activeOptionClassName="bg-surface-2"
    />
  );
}

/**
 * The dominant header search: category scope + input + indigo button, with
 * an autocomplete panel (popular searches, categories, lots). ↑/↓ move,
 * Enter opens the highlighted row or searches, Esc closes.
 */
export function SearchBar({ className = "" }) {
  const { ui, t } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  const navigate = useBrowseNavigate();
  const { setPinned } = useChrome();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const id = useId();
  const listId = `${id}-list`;

  const groups = useSuggestions(query, scope);
  const flat = groups.flatMap((group) => group.items);

  const close = useCallback(() => {
    setOpen(false);
    setActive(-1);
    setPinned(false);
  }, [setPinned]);
  useDismiss(open, close, rootRef);

  const openPanel = () => {
    setOpen(true);
    setPinned(true);
  };

  const submit = (value = query) => {
    const q = value.trim();
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    if (scope !== "all") params.set("category", scope);
    close();
    inputRef.current?.blur();
    const qs = params.toString();
    navigate(`/browse${qs ? `?${qs}` : ""}`);
  };

  const pick = (item) => {
    if (item.kind === "popular") {
      setQuery(item.label);
      submit(item.label);
    } else if (item.kind === "category") {
      close();
      navigate(`/browse?category=${item.slug}`);
    } else if (item.kind === "lot") {
      close();
      router.push(link(detailPath(item.product)));
    } else {
      submit();
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) openPanel();
      setActive((i) => Math.min(flat.length - 1, i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(-1, i - 1));
    } else if (event.key === "Enter" && open && active >= 0 && flat[active]) {
      event.preventDefault();
      pick(flat[active]);
    } else if (event.key === "Escape") {
      if (open) close();
      else setQuery("");
    }
  };

  return (
    <form
      role="search"
      ref={rootRef}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className={cx("relative", className)}
    >
      <div className="flex h-12 items-stretch rounded-full border border-line-strong bg-surface shadow-card transition-[box-shadow,border-color] focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/12">
        <ScopeSelect value={scope} onChange={setScope} />
        <div className="relative flex min-w-0 flex-1 items-center">
          <Search aria-hidden="true" className="pointer-events-none ms-4 size-4 shrink-0 text-fg-3 lg:hidden" />
          <label htmlFor={`${id}-input`} className="sr-only">
            {ui("search")}
          </label>
          <input
            ref={inputRef}
            id={`${id}-input`}
            data-testid="search-input"
            type="search"
            role="combobox"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={open && active >= 0 ? `${id}-opt-${active}` : undefined}
            autoComplete="off"
            enterKeyHint="search"
            value={query}
            placeholder={ui("searchPlaceholder")}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(-1);
              if (!open) openPanel();
            }}
            onFocus={openPanel}
            onKeyDown={onKeyDown}
            className="kb-search h-full min-w-0 flex-1 bg-transparent px-4 kb-md text-fg outline-none placeholder:text-fg-3"
          />
          {query ? (
            <button
              type="button"
              aria-label={t(COPY.clearSearch)}
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="me-1 grid size-8 shrink-0 place-items-center rounded-md text-fg-3 hover:bg-surface-2 hover:text-fg"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          ) : null}
        </div>
        <button
          type="submit"
          aria-label={ui("search")}
          className="flex shrink-0 items-center gap-2 rounded-e-full bg-primary ps-4 pe-5 font-semibold text-on-primary transition-colors hover:bg-primary-hover lg:pe-6"
        >
          <Search aria-hidden="true" className="size-[18px]" strokeWidth={2.25} />
          <span className="hidden kb-md xl:inline">{ui("search")}</span>
        </button>
      </div>
      {open ? <SearchSuggest id={id} listId={listId} groups={groups} active={active} setActive={setActive} onPick={pick} query={query} /> : null}
    </form>
  );
}
