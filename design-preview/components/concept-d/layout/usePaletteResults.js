"use client";

import { useMemo } from "react";
import { CATEGORIES } from "@/data/categories";
import { SELLERS, CITIES } from "@/data/sellers";
import { detailPath, endingSoon, searchProducts } from "@/lib/catalog";

const hay = (...parts) => parts.join(" ").toLowerCase();

/**
 * Grouped command-palette results with a flat option list for ↑/↓.
 * Idle (empty query) shows the lots closing soonest and every category.
 */
export function usePaletteResults(query, lang, link) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    const lots = q ? searchProducts(q, lang).slice(0, 6) : endingSoon(4);
    const categories = q
      ? CATEGORIES.filter((cat) => hay(cat.name.en, cat.name.ar, cat.slug, cat.blurb.en, cat.blurb.ar).includes(q)).slice(0, 4)
      : CATEGORIES;
    const sellers = q
      ? SELLERS.filter((s) => hay(s.name.en, s.name.ar, s.code, CITIES[s.city].en, CITIES[s.city].ar).includes(q)).slice(0, 3)
      : [];

    const groups = [];
    if (lots.length) {
      groups.push({ key: q ? "lots" : "closing", items: lots.map((p) => ({ id: `lot-${p.slug}`, kind: "lot", product: p, href: link(detailPath(p)) })) });
    }
    if (categories.length) {
      groups.push({ key: "categories", items: categories.map((cat) => ({ id: `cat-${cat.slug}`, kind: "category", category: cat, href: link(`/browse?category=${cat.slug}`) })) });
    }
    if (sellers.length) {
      groups.push({ key: "sellers", items: sellers.map((s) => ({ id: `seller-${s.code}`, kind: "seller", seller: s, href: link(`/seller/${s.code}`) })) });
    }
    if (q) {
      groups.push({ key: "all", items: [{ id: "see-all", kind: "all", href: link(`/browse?search=${encodeURIComponent(query.trim())}`) }] });
    }
    const flat = groups.flatMap((g) => g.items);
    const empty = q && !lots.length && !categories.length && !sellers.length;
    return { groups, flat, empty };
  }, [query, lang, link]);
}
