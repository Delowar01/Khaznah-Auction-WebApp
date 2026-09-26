"use client";

import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Clock3, Radio, Search as SearchIcon, Store, Tag, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Money } from "@/components/shared/ui/Money";
import { CATEGORIES } from "@/data/categories";
import { SELLERS, CITIES } from "@/data/sellers";
import { isAuction, isBuyNow } from "@/data/products";
import { POPULAR_SEARCHES, hotAuctions, searchProducts } from "@/lib/catalog";
import { COPY } from "./copy";
import { useHub } from "./state";
import { Kbd, Thumb, TimeLeft, btnClass, cx } from "./ui";

export const SCOPES = [
  { key: "all", label: COPY.scopeAll },
  { key: "auction", label: COPY.auctions },
  { key: "buy_now", label: COPY.buyNow },
  { key: "sellers", label: COPY.scopeSellers },
  { key: "live", label: COPY.scopeLive },
];

const RECENT_KEY = "kz-hub-recent";

function readRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]").slice(0, 4);
  } catch {
    return [];
  }
}

function writeRecent(list) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 4)));
  } catch {
    // storage unavailable — recent searches are a convenience only
  }
}

/** Scope tabs (a setting, so a radio group rather than tabs). */
export function ScopeTabs({ className = "" }) {
  const { t } = useLang();
  const { scope, setScope } = useHub();
  return (
    <div role="radiogroup" aria-label={t(COPY.scope)} className={cx("flex flex-wrap gap-1.5", className)}>
      {SCOPES.map((item) => {
        const on = scope === item.key;
        return (
          <button
            key={item.key}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => setScope(item.key)}
            className={cx(
              "h-8 rounded-full border px-3.5 hb-sm font-semibold transition-colors",
              on ? "border-fg bg-fg text-bg" : "border-line bg-surface text-fg-2 hover:border-line-strong hover:text-fg",
            )}
          >
            {t(item.label)}
          </button>
        );
      })}
    </div>
  );
}

function scopeMatch(scope, product) {
  if (scope === "auction") return isAuction(product);
  if (scope === "buy_now") return isBuyNow(product);
  return true;
}

/**
 * Search field with a multi-column suggestions panel (Suggestions ·
 * Categories · Sellers · Top lots). Fully keyboard-navigable (combobox +
 * listbox); recent searches are kept in this browser only.
 */
export const SearchBox = forwardRef(function SearchBox({ variant = "deck", onDone, autoFocus = false, inputId: fixedId, className = "" }, ref) {
  const { t, lang } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  const { scope, openQuick } = useHub();
  const autoId = useId();
  const inputId = fixedId || autoId;
  const listId = useId();
  const inputRef = useRef(null);
  const wrapRef = useRef(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [recent, setRecent] = useState([]);

  useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }), []);

  useEffect(() => {
    // Recent searches live in localStorage (client only).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecent(readRecent());
  }, []);

  // The rail variant opens as a flyout beside the rail (the rail scrolls, so
  // an in-flow panel would be clipped).
  const [flyout, setFlyout] = useState(null);
  useEffect(() => {
    if (!open || variant !== "rail") return undefined;
    const place = () => {
      const form = wrapRef.current?.getBoundingClientRect();
      const aside = wrapRef.current?.closest("aside")?.getBoundingClientRect();
      if (!form || !aside) return;
      const rtl = document.documentElement.dir === "rtl";
      setFlyout(rtl ? { top: form.top, right: window.innerWidth - aside.left + 8 } : { top: form.top, left: aside.right + 8 });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open, variant]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const q = query.trim();
  const scopeLabel = t(SCOPES.find((s) => s.key === scope)?.label || COPY.scopeAll);

  const submit = useCallback(
    (term) => {
      const value = String(term ?? "").trim();
      if (value) {
        const next = [value, ...readRecent().filter((r) => r.toLowerCase() !== value.toLowerCase())];
        writeRecent(next);
        setRecent(next.slice(0, 4));
      }
      setOpen(false);
      onDone?.();
      if (scope === "live") return router.push(link("/live-auction"));
      if (scope === "sellers") {
        const seller = SELLERS.find((s) => s.name.en.toLowerCase().includes(value.toLowerCase()) || s.name.ar.includes(value));
        return router.push(link(seller ? `/seller/${seller.code}` : "/seller"));
      }
      const params = new URLSearchParams();
      if (scope === "auction" || scope === "buy_now") params.set("tab", scope);
      if (value) params.set("search", value);
      const qs = params.toString();
      router.push(link(`/browse${qs ? `?${qs}` : ""}`));
    },
    [link, onDone, router, scope],
  );

  const go = useCallback(
    (path) => {
      setOpen(false);
      onDone?.();
      router.push(link(path));
    },
    [link, onDone, router],
  );

  const quickView = useCallback(
    (slug) => {
      setOpen(false);
      onDone?.();
      openQuick(slug);
    },
    [onDone, openQuick],
  );

  // Option groups for the panel. Every option has an id and a run().
  const groups = useMemo(() => {
    const out = [];
    const needle = q.toLowerCase();
    if (scope === "live") {
      out.push({ key: "live", label: t(COPY.scopeLive), items: [{ id: "live-room", kind: "live", label: t(COPY.openLiveRoom), run: () => submit(q) }] });
      return out;
    }
    const terms = !q
      ? [...recent.map((r) => ({ label: r, recent: true })), ...POPULAR_SEARCHES.map((p) => ({ label: t(p) }))]
      : [
          { label: q, primary: true },
          ...POPULAR_SEARCHES.map((p) => ({ label: t(p) })).filter((p) => p.label.toLowerCase().includes(needle) && p.label.toLowerCase() !== needle),
        ];
    if (scope !== "sellers") {
      out.push({
        key: "suggestions",
        label: q ? t(COPY.suggestions) : recent.length ? `${t(COPY.recent)} · ${t(COPY.popular)}` : t(COPY.popular),
        items: terms.slice(0, 6).map((term, i) => ({
          id: `term-${i}`,
          kind: term.primary ? "search" : term.recent ? "recent" : "term",
          label: term.primary ? (scope === "all" ? t(COPY.searchFor, { q }) : t(COPY.searchForIn, { q, scope: scopeLabel })) : term.label,
          run: () => submit(term.label),
        })),
      });
    }
    const cats = (q ? CATEGORIES.filter((c) => c.name.en.toLowerCase().includes(needle) || c.name.ar.includes(q)) : scope === "sellers" ? [] : CATEGORIES.slice(0, 4)).slice(0, 4);
    if (cats.length && scope !== "sellers") {
      out.push({
        key: "categories",
        label: t(COPY.categories),
        items: cats.map((c) => ({
          id: `cat-${c.slug}`,
          kind: "category",
          label: t(c.name),
          run: () => go(`/browse?category=${c.slug}${scope === "auction" || scope === "buy_now" ? `&tab=${scope}` : ""}`),
        })),
      });
    }
    const sellers = (q ? SELLERS.filter((s) => s.name.en.toLowerCase().includes(needle) || s.name.ar.includes(q)) : scope === "sellers" ? SELLERS : []).slice(0, 5);
    if (sellers.length) {
      out.push({
        key: "sellers",
        label: t(COPY.sellers),
        items: sellers.map((s) => ({
          id: `seller-${s.code}`,
          kind: "seller",
          label: t(s.name),
          sub: t(CITIES[s.city]),
          live: s.liveNow,
          run: () => go(`/seller/${s.code}`),
        })),
      });
    }
    if (scope !== "sellers") {
      const lots = (q ? searchProducts(q) : hotAuctions(6)).filter((p) => p.status !== "sold" && scopeMatch(scope, p)).slice(0, 4);
      if (lots.length) {
        out.push({
          key: "lots",
          label: t(COPY.topLots),
          items: lots.map((p) => ({ id: `lot-${p.slug}`, kind: "lot", label: t(p.title), product: p, run: () => quickView(p.slug) })),
        });
      }
    }
    return out;
  }, [q, scope, scopeLabel, recent, t, submit, go, quickView]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const activeItem = active >= 0 ? flat[active] : null;

  const onKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((i) => (flat.length ? (i + 1) % flat.length : -1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActive((i) => (flat.length ? (i <= 0 ? flat.length - 1 : i - 1) : -1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (open && activeItem) activeItem.run();
      else submit(q);
    } else if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        setActive(-1);
      }
    }
  };

  const deck = variant === "deck";
  const rail = variant === "rail";
  const empty = q && !flat.length;

  return (
    <div ref={wrapRef} className={cx("relative", className)}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          submit(q);
        }}
        className={cx(
          "flex items-center gap-2 border bg-surface transition-colors focus-within:border-primary",
          deck ? "h-12 rounded-[10px] border-line-strong ps-3.5 pe-1.5" : rail ? "h-9 rounded-[8px] border-line ps-2.5 pe-1" : "h-11 rounded-[10px] border-line-strong ps-3 pe-1.5",
        )}
      >
        <label htmlFor={inputId} className="sr-only">
          {t(COPY.searchLabel)}
        </label>
        <SearchIcon aria-hidden="true" className={cx("shrink-0 text-fg-3", rail ? "size-4" : "size-5")} />
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && activeItem ? `${listId}-${activeItem.id}` : undefined}
          autoComplete="off"
          enterKeyHint="search"
          autoFocus={autoFocus}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onKeyDown={onKeyDown}
          placeholder={rail ? t(COPY.searchShort) : t(COPY.searchPlaceholder)}
          className={cx("hb-search min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-fg-3", rail ? "hb-sm" : "hb-md")}
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label={t(COPY.clearRecent)}
            className="grid size-7 place-items-center rounded-md text-fg-3 hover:bg-surface-2 hover:text-fg"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        ) : deck ? (
          <Kbd className="hidden md:inline-grid" aria-hidden="true">
            /
          </Kbd>
        ) : null}
        {!rail ? (
          <button type="submit" className={btnClass("primary", deck ? "md" : "sm", deck ? "ms-1" : "")}>
            {t(COPY.search)}
          </button>
        ) : null}
      </form>

      {open && (flat.length || empty) ? (
        <div
          style={rail ? flyout || { visibility: "hidden" } : undefined}
          className={cx(
            "z-50 overflow-hidden rounded-[12px] border border-line bg-elevated kz-fade-up",
            variant === "sheet" ? "relative mt-2" : rail ? "fixed w-[min(680px,calc(100vw-290px))] shadow-overlay" : "absolute inset-x-0 mt-2 shadow-overlay",
          )}
        >
          <div id={listId} role="listbox" aria-label={t(COPY.suggestions)} className={cx("grid gap-x-2 overflow-y-auto p-2", variant === "sheet" ? "" : "max-h-[min(460px,60dvh)] md:grid-cols-3")}>
            {empty ? (
              <p className="px-3 py-4 hb-sm text-fg-2 md:col-span-3">{t(COPY.noMatch, { q })}</p>
            ) : (
              groups.map((group) => (
                <div key={group.key} role="group" aria-label={group.label} className={cx("py-1", group.key === "lots" && variant !== "sheet" ? "md:col-span-1" : "")}>
                  <p aria-hidden="true" className="px-2.5 pb-1 pt-1.5 hb-eyebrow text-fg-3">
                    {group.label}
                  </p>
                  {group.items.map((item) => {
                    const index = flat.indexOf(item);
                    const on = index === active;
                    return (
                      <div
                        key={item.id}
                        id={`${listId}-${item.id}`}
                        role="option"
                        aria-selected={on}
                        onMouseEnter={() => setActive(index)}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => item.run()}
                        className={cx("flex cursor-pointer items-center gap-2.5 rounded-[8px] px-2.5 py-2 hb-sm", on ? "bg-surface-2" : "")}
                      >
                        {item.kind === "lot" ? (
                          <>
                            <Thumb image={item.product.images[0]} size={36} />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium text-fg">{item.label}</span>
                              <span className="flex items-center gap-1.5 hb-xs text-fg-3">
                                <Money value={isAuction(item.product) ? item.product.currentBid : item.product.price} className="font-semibold text-fg-2" />
                                {isAuction(item.product) && item.product.status === "live" ? (
                                  <>
                                    · <TimeLeft endsIn={item.product.endsIn} />
                                  </>
                                ) : null}
                              </span>
                            </span>
                          </>
                        ) : (
                          <>
                            {item.kind === "recent" ? (
                              <Clock3 aria-hidden="true" className="size-4 shrink-0 text-fg-3" />
                            ) : item.kind === "category" ? (
                              <Tag aria-hidden="true" className="size-4 shrink-0 text-fg-3" />
                            ) : item.kind === "seller" ? (
                              <Store aria-hidden="true" className="size-4 shrink-0 text-fg-3" />
                            ) : item.kind === "live" ? (
                              <Radio aria-hidden="true" className="size-4 shrink-0 text-live" />
                            ) : (
                              <SearchIcon aria-hidden="true" className="size-4 shrink-0 text-fg-3" />
                            )}
                            <span className={cx("min-w-0 flex-1 truncate", item.kind === "search" ? "font-semibold text-fg" : "text-fg")}>{item.label}</span>
                            {item.sub ? <span className="hb-xs text-fg-3">{item.sub}</span> : null}
                            {item.live ? <span className="rounded-[4px] bg-[var(--hb-live-badge)] px-1.5 hb-2xs font-bold uppercase text-white">{lang === "ar" ? "مباشر" : "Live"}</span> : null}
                            {item.kind === "category" || item.kind === "seller" ? <ArrowUpRight aria-hidden="true" className="flip-rtl size-3.5 text-fg-3" /> : null}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
});
