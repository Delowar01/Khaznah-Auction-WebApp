"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { Modal } from "@/components/shared/ui/Modal";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { CATEGORIES } from "@/data/categories";
import { POPULAR_SEARCHES, detailPath, endingSoon, isAuction, searchProducts } from "@/lib/catalog";
import { COPY } from "../copy";

export function SearchOverlay({ open, onClose }) {
  const { t, ui, lang } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const results = useMemo(() => (query.trim() ? searchProducts(query, lang).slice(0, 6) : []), [query, lang]);
  const picks = endingSoon(3);

  const submit = (value) => {
    const q = String(value ?? query).trim();
    onClose();
    router.push(link(`/browse${q ? `?search=${encodeURIComponent(q)}` : ""}`));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={ui("search")}
      panelClassName="max-w-none md:max-w-4xl md:self-start md:mt-[calc(var(--pbar-h)+28px)] rounded-t-xl md:rounded-xl bg-elevated text-fg shadow-overlay"
    >
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="flex items-center gap-4 border-b border-line px-6 py-5 md:px-8"
      >
        <Search aria-hidden="true" className="size-6 shrink-0 text-fg-3" />
        <label htmlFor="a-search" className="sr-only">
          {ui("searchPlaceholder")}
        </label>
        <input
          id="a-search"
          data-testid="search-input"
          data-autofocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t(COPY.searchPrompt)}
          autoComplete="off"
          className="a-serif min-w-0 flex-1 bg-transparent text-[28px] text-fg outline-none placeholder:text-fg-3 md:text-[34px]"
        />
        <button type="button" onClick={onClose} aria-label={ui("close")} className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-surface-2">
          <X aria-hidden="true" className="size-5" />
        </button>
      </form>

      <div className="grid gap-10 px-6 py-7 md:grid-cols-[1fr_1.1fr] md:px-8">
        {query.trim() ? (
          <div className="md:col-span-2">
            <p className="a-eyebrow mb-4">{t(COPY.topMatches)}</p>
            {results.length ? (
              <ul className="divide-y divide-line">
                {results.map((p) => (
                  <li key={p.slug}>
                    <Link href={link(detailPath(p))} onClick={onClose} className="group flex items-center gap-4 py-3">
                      <span className="relative size-14 shrink-0 overflow-hidden rounded-card bg-plate">
                        <Img image={p.images[0]} alt="" sizes="56px" className="a-plate-img absolute inset-0 size-full object-contain p-1.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-medium text-fg group-hover:underline">{t(p.title)}</span>
                        <span className="text-[12px] text-fg-3">{ui(isAuction(p) ? "auction" : "buyNow")} · {p.lot}</span>
                      </span>
                      <Money value={isAuction(p) ? p.currentBid : p.price} className="a-serif text-lg text-fg" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-fg-2">{ui("emptyTitle")}</p>
            )}
            <button type="button" onClick={() => submit()} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-fg">
              <span className="a-link">{t(COPY.seeAllResults)}</span>
              <DirIcon icon={ArrowRight} className="size-4" />
            </button>
          </div>
        ) : (
          <>
            <div>
              <p className="a-eyebrow mb-4">{ui("popularSearches")}</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((s) => (
                  <button key={s.en} type="button" onClick={() => submit(t(s))} className="h-10 rounded-full border border-line-strong px-4 text-sm text-fg transition-colors hover:border-fg">
                    {t(s)}
                  </button>
                ))}
              </div>
              <p className="a-eyebrow mb-3 mt-8">{t(COPY.departments)}</p>
              <ul className="grid grid-cols-2 gap-x-6">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link href={link(`/browse?category=${c.slug}`)} onClick={onClose} className="block py-1.5 text-[15px] text-fg-2 hover:text-fg">
                      {t(c.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="a-eyebrow mb-4">{t(COPY.closingSoon)}</p>
              <ul className="space-y-3">
                {picks.map((p) => (
                  <li key={p.slug}>
                    <Link href={link(detailPath(p))} onClick={onClose} className="group flex items-center gap-4">
                      <span className="relative size-16 shrink-0 overflow-hidden rounded-card bg-plate">
                        <Img image={p.images[0]} alt="" sizes="64px" className="a-plate-img absolute inset-0 size-full object-contain p-2" />
                      </span>
                      <span className="min-w-0">
                        <span className="a-serif block text-[18px] leading-snug text-fg group-hover:underline">{t(p.title)}</span>
                        <Money value={p.currentBid} className="text-sm text-fg-2" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
