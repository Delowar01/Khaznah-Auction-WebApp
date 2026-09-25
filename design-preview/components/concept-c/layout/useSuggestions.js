"use client";

import { useMemo } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { CATEGORIES } from "@/data/categories";
import { POPULAR_SEARCHES, hotAuctions, searchProducts } from "@/lib/catalog";
import { COPY } from "../copy";

/**
 * Autocomplete groups for the header search. Empty query: popular searches
 * and suggested lots. Typed query: matching categories, up to five matching
 * lots (respecting the category scope) and a "see all results" row.
 */
export function useSuggestions(query, scope) {
  const { lang, t, ui } = useLang();
  return useMemo(() => {
    const q = query.trim();
    if (!q) {
      return [
        {
          key: "popular",
          label: ui("popularSearches"),
          layout: "chips",
          items: POPULAR_SEARCHES.map((p, i) => ({ id: `popular-${i}`, kind: "popular", label: t(p) })),
        },
        {
          key: "lots",
          label: ui("suggestedLots"),
          items: hotAuctions(3).map((p) => ({ id: p.slug, kind: "lot", product: p })),
        },
      ];
    }

    const needle = q.toLowerCase();
    const categories = CATEGORIES.filter((c) => c.name.en.toLowerCase().includes(needle) || c.name.ar.includes(q))
      .slice(0, 3)
      .map((c) => ({ id: `cat-${c.slug}`, kind: "category", slug: c.slug, label: t(c.name), category: c }));
    const lots = searchProducts(q, lang)
      .filter((p) => p.status !== "sold" && (scope === "all" || p.category === scope))
      .slice(0, 5)
      .map((p) => ({ id: p.slug, kind: "lot", product: p }));

    const groups = [];
    if (categories.length) groups.push({ key: "categories", label: ui("categories"), items: categories });
    if (lots.length) groups.push({ key: "lots", label: ui("suggestedLots"), items: lots });
    groups.push({ key: "all", label: null, items: [{ id: "all", kind: "all", label: t(COPY.seeAllResults, { q }) }] });
    return groups;
  }, [query, scope, lang, t, ui]);
}
