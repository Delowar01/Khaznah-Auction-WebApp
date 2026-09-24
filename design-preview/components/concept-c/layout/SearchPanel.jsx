"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Money } from "@/components/shared/ui/Money";
import { CATEGORIES } from "@/data/categories";
import { POPULAR_SEARCHES, detailPath, isAuction, searchProducts } from "@/lib/catalog";
import { COPY } from "../copy";
import { emitBrowseIntent, isBrowsePath } from "../browse/browseIntent";
import { PlateImage } from "../ui/Frame";
import { Diamond } from "../ui/Diamond";
import { btnClass } from "../ui/Button";

/** Full-width search panel that drops below the header. */
export function SearchPanel({ open, onClose, triggerRef }) {
  const { t, ui, lang } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const inputId = useId();
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    const onPointer = (event) => {
      if (panelRef.current?.contains(event.target) || triggerRef?.current?.contains(event.target)) return;
      onClose();
    };
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      onClose();
      triggerRef?.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, triggerRef]);

  const go = (intent) => {
    const params = new URLSearchParams();
    if (intent.search) params.set("search", intent.search);
    if (intent.category) params.set("category", intent.category);
    if (isBrowsePath(pathname)) emitBrowseIntent({ tab: "all", category: null, search: "", ...intent });
    else router.push(link(`/browse${params.toString() ? `?${params}` : ""}`));
    onClose();
  };

  const q = query.trim();
  const matches = q ? searchProducts(q, lang).slice(0, 4) : [];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="search"
          ref={panelRef}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-var(--pbar-h)-4rem)] overflow-y-auto border-b border-line bg-bg shadow-raised"
        >
          <div className="c-container py-6 lg:py-9">
            <form
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                go({ search: q });
              }}
              className="flex items-center gap-3 border-b-2 border-fg pb-3"
            >
              <Search aria-hidden="true" className="size-6 shrink-0 text-fg-2" />
              <label htmlFor={inputId} className="sr-only">
                {ui("search")}
              </label>
              <input
                ref={inputRef}
                id={inputId}
                type="search"
                data-testid="search-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={ui("searchPlaceholder")}
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent font-display text-xl font-semibold text-fg outline-none placeholder:font-normal placeholder:text-fg-3 sm:text-3xl"
              />
              <button type="submit" className={btnClass({ variant: "primary", className: "hidden sm:inline-flex" })}>
                {ui("search")}
              </button>
              <button type="button" onClick={onClose} aria-label={t(COPY.closeSearch)} className="c-iconbtn shrink-0 text-fg-2">
                <X aria-hidden="true" className="size-5" />
              </button>
            </form>

            <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.3fr] lg:gap-12">
              <div>
                <p className="c-caps mb-4 text-fg-3">{ui("popularSearches")}</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button key={term.en} type="button" onClick={() => go({ search: t(term) })} className="c-chip">
                      <Search aria-hidden="true" className="size-3.5 text-fg-3" />
                      {t(term)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="c-caps mb-4 text-fg-3">{ui("categories")}</p>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
                  {CATEGORIES.map((category) => (
                    <li key={category.slug}>
                      <button type="button" onClick={() => go({ category: category.slug })} className="flex min-h-10 w-full items-center gap-2.5 text-start text-[0.9375rem] text-fg-2 hover:text-fg">
                        <Diamond size={5} className="text-line-strong" />
                        {t(category.name)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <p className="c-caps mb-4 text-fg-3">{t(COPY.topMatches)}</p>
                {!q ? (
                  <p className="text-sm text-fg-3">{t(COPY.searchHint)}</p>
                ) : matches.length ? (
                  <ul className="divide-y divide-line border-y border-line">
                    {matches.map((product) => (
                      <li key={product.slug}>
                        <Link href={link(detailPath(product))} onClick={onClose} className="group flex items-center gap-4 py-2.5 hover:bg-surface">
                          <PlateImage image={product.images[0]} alt="" sizes="56px" className="size-14 shrink-0" />
                          <span className="min-w-0 flex-1">
                            <span className="line-clamp-1 font-medium text-fg">{t(product.title)}</span>
                            <span className="text-xs text-fg-3">{ui(isAuction(product) ? "auction" : "buyNow")}</span>
                          </span>
                          <Money value={isAuction(product) ? product.currentBid : product.price} className="c-num shrink-0 font-semibold text-fg" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-fg-3">{t(COPY.noMatches)}</p>
                )}
                {q ? (
                  <button type="button" onClick={() => go({ search: q })} className="c-link mt-4 text-sm font-semibold text-primary">
                    {t(COPY.searchAll, { q })}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
