"use client";

// Browse / storefront state shared by every concept.
//
// Modelled on the production /browse contract so the chosen design can later
// be wired to the real hook (exact differences: CUSTOMER_REDESIGN_FILE_MAP.md,
// section G):
//   URL params: tab (auction|buy_now|all), search, category, condition,
//   item_type, min_price, max_price, ending (1h|6h|24h), in_stock,
//   has_discount, sort, page — kept in sync with history.replaceState.
//
// Results come from the sample catalogue; a short simulated loading state
// shows how skeletons behave when filters change.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PRODUCTS, isAuction, isBuyNow } from "@/data/products";
import { matchesQuery } from "@/lib/catalog";

const DEFAULTS = {
  tab: "all",
  search: "",
  categories: [],
  grades: [],
  itemTypes: [],
  price: [0, 10000],
  ending: "all",
  inStock: false,
  discounted: false,
  sort: "recommended",
  page: 1,
};

export const PRICE_BOUNDS = [0, 10000];

export const SORT_OPTIONS = [
  { value: "recommended", key: "sortEnding" },
  { value: "newest", key: "sortNewest" },
  { value: "price_low", key: "sortPriceLow" },
  { value: "price_high", key: "sortPriceHigh" },
  { value: "most_bids", key: "sortMostBids" },
];

const ENDING_SECONDS = { "1h": 3600, "6h": 6 * 3600, "24h": 24 * 3600 };

const listParam = (params, key) =>
  (params.get(key) || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

function readUrl() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const state = {};
  const tab = params.get("tab");
  if (tab === "auction" || tab === "buy_now" || tab === "live") state.tab = tab;
  const search = params.get("search") || params.get("q");
  if (search) state.search = search;
  const categories = listParam(params, "category");
  if (categories.length) state.categories = categories;
  const grades = listParam(params, "condition");
  if (grades.length) state.grades = grades;
  const itemTypes = listParam(params, "item_type");
  if (itemTypes.length) state.itemTypes = itemTypes;
  const min = Number(params.get("min_price"));
  const max = Number(params.get("max_price"));
  if (params.has("min_price") || params.has("max_price")) {
    state.price = [Number.isFinite(min) ? min : PRICE_BOUNDS[0], Number.isFinite(max) && max > 0 ? max : PRICE_BOUNDS[1]];
  }
  const ending = params.get("ending");
  if (ENDING_SECONDS[ending]) state.ending = ending;
  if (params.get("in_stock") === "true") state.inStock = true;
  if (params.get("has_discount") === "true") state.discounted = true;
  const sort = params.get("sort");
  if (SORT_OPTIONS.some((o) => o.value === sort)) state.sort = sort;
  const page = Number(params.get("page"));
  if (page > 1) state.page = page;
  return state;
}

function writeUrl(state) {
  const params = new URLSearchParams(window.location.search);
  const set = (key, value) => (value ? params.set(key, value) : params.delete(key));
  set("tab", state.tab !== "all" ? state.tab : "");
  set("search", state.search.trim());
  params.delete("q");
  set("category", state.categories.join(","));
  set("condition", state.grades.join(","));
  set("item_type", state.itemTypes.join(","));
  set("min_price", state.price[0] > PRICE_BOUNDS[0] ? String(state.price[0]) : "");
  set("max_price", state.price[1] < PRICE_BOUNDS[1] ? String(state.price[1]) : "");
  set("ending", state.ending !== "all" ? state.ending : "");
  set("in_stock", state.inStock ? "true" : "");
  set("has_discount", state.discounted ? "true" : "");
  set("sort", state.sort !== "recommended" ? state.sort : "");
  set("page", state.page > 1 ? String(state.page) : "");
  const query = params.toString();
  const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState(window.history.state, "", url);
}

export function priceOf(product) {
  return isAuction(product) ? product.currentBid : product.price;
}

function matches(product, state, { ignore } = {}) {
  if (state.tab === "auction" && !isAuction(product)) return false;
  if (state.tab === "buy_now" && !isBuyNow(product)) return false;
  if (state.search && !matchesQuery(product, state.search)) return false;
  if (ignore !== "categories" && state.categories.length && !state.categories.includes(product.category)) return false;
  if (ignore !== "grades" && state.grades.length && !state.grades.includes(product.grade)) return false;
  if (ignore !== "itemTypes" && state.itemTypes.length && !state.itemTypes.includes(product.itemType)) return false;
  const price = priceOf(product);
  if (price < state.price[0] || price > state.price[1]) return false;
  if (state.ending !== "all") {
    if (!isAuction(product) || product.status !== "live" || product.endsIn > ENDING_SECONDS[state.ending]) return false;
  }
  if (state.inStock && isBuyNow(product) && product.stock <= 0) return false;
  if (state.discounted && !(isBuyNow(product) && product.originalPrice > product.price)) return false;
  return true;
}

function sortProducts(list, sort) {
  const rows = list.slice();
  const liveFirst = (a, b) => (a.status === "sold") - (b.status === "sold");
  switch (sort) {
    case "newest":
      return rows.sort((a, b) => liveFirst(a, b) || (a.listedHoursAgo ?? 0) - (b.listedHoursAgo ?? 0));
    case "price_low":
      return rows.sort((a, b) => liveFirst(a, b) || priceOf(a) - priceOf(b));
    case "price_high":
      return rows.sort((a, b) => liveFirst(a, b) || priceOf(b) - priceOf(a));
    case "most_bids":
      return rows.sort((a, b) => liveFirst(a, b) || (b.bidCount ?? -1) - (a.bidCount ?? -1));
    default:
      // Recommended: live auctions by time left, then Buy Now, then upcoming.
      return rows.sort((a, b) => {
        const rank = (p) => (p.status === "sold" ? 4 : p.status === "scheduled" ? 3 : isAuction(p) ? 1 : 2);
        const r = rank(a) - rank(b);
        if (r) return r;
        if (isAuction(a) && isAuction(b)) return a.endsIn - b.endsIn;
        return (a.listedHoursAgo ?? 0) - (b.listedHoursAgo ?? 0);
      });
  }
}

export function useBrowse({ sellerCode = null, pageSize = 12, initial = {}, syncUrl = true } = {}) {
  const [state, setState] = useState(() => ({ ...DEFAULTS, ...initial }));
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visible, setVisible] = useState(pageSize);
  const loadingTimer = useRef(null);
  const hydrated = useRef(false);

  // Adopt URL parameters once on the client (keeps the static render stable).
  useEffect(() => {
    const fromUrl = syncUrl ? readUrl() : {};
    if (Object.keys(fromUrl).length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState((s) => ({ ...s, ...fromUrl }));
      setLoading(true);
      loadingTimer.current = window.setTimeout(() => setLoading(false), 450);
    }
    hydrated.current = true;
    return () => window.clearTimeout(loadingTimer.current);
  }, [syncUrl]);

  useEffect(() => {
    if (hydrated.current && syncUrl) writeUrl(state);
  }, [state, syncUrl]);

  const update = useCallback(
    (patch, { resetPage = true } = {}) => {
      setState((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch), ...(resetPage ? { page: 1 } : {}) }));
      if (resetPage) setVisible(pageSize);
      window.clearTimeout(loadingTimer.current);
      setLoading(true);
      loadingTimer.current = window.setTimeout(() => setLoading(false), 420);
    },
    [pageSize],
  );

  const toggleIn = (key) => (value) =>
    update((s) => ({ [key]: s[key].includes(value) ? s[key].filter((v) => v !== value) : [...s[key], value] }));

  const base = useMemo(
    () => PRODUCTS.filter((p) => (sellerCode ? p.seller === sellerCode : true)),
    [sellerCode],
  );

  const results = useMemo(() => sortProducts(base.filter((p) => matches(p, state)), state.sort), [base, state]);

  const facets = useMemo(() => {
    const count = (key, field) => {
      const counts = {};
      base.filter((p) => matches(p, state, { ignore: key })).forEach((p) => {
        counts[p[field]] = (counts[p[field]] || 0) + 1;
      });
      return counts;
    };
    return {
      categories: count("categories", "category"),
      grades: count("grades", "grade"),
      itemTypes: count("itemTypes", "itemType"),
      tabs: {
        all: base.filter((p) => matches(p, { ...state, tab: "all" })).length,
        auction: base.filter((p) => matches(p, { ...state, tab: "auction" })).length,
        buy_now: base.filter((p) => matches(p, { ...state, tab: "buy_now" })).length,
      },
    };
  }, [base, state]);

  const active = useMemo(() => {
    const list = [];
    state.categories.forEach((value) => list.push({ type: "category", value }));
    state.grades.forEach((value) => list.push({ type: "grade", value }));
    state.itemTypes.forEach((value) => list.push({ type: "itemType", value }));
    if (state.price[0] > PRICE_BOUNDS[0] || state.price[1] < PRICE_BOUNDS[1]) list.push({ type: "price", value: state.price });
    if (state.ending !== "all") list.push({ type: "ending", value: state.ending });
    if (state.inStock) list.push({ type: "inStock", value: true });
    if (state.discounted) list.push({ type: "discounted", value: true });
    if (state.search) list.push({ type: "search", value: state.search });
    return list;
  }, [state]);

  const removeFilter = useCallback(
    (filter) => {
      if (filter.type === "category") update((s) => ({ categories: s.categories.filter((v) => v !== filter.value) }));
      else if (filter.type === "grade") update((s) => ({ grades: s.grades.filter((v) => v !== filter.value) }));
      else if (filter.type === "itemType") update((s) => ({ itemTypes: s.itemTypes.filter((v) => v !== filter.value) }));
      else if (filter.type === "price") update({ price: PRICE_BOUNDS });
      else if (filter.type === "ending") update({ ending: "all" });
      else if (filter.type === "inStock") update({ inStock: false });
      else if (filter.type === "discounted") update({ discounted: false });
      else if (filter.type === "search") update({ search: "" });
    },
    [update],
  );

  const clearAll = useCallback(
    () => update((s) => ({ ...DEFAULTS, tab: s.tab, sort: s.sort })),
    [update],
  );

  const pageCount = Math.max(1, Math.ceil(results.length / pageSize));
  const page = Math.min(state.page, pageCount);
  const pageItems = results.slice((page - 1) * pageSize, page * pageSize);
  const shownItems = results.slice(0, visible);

  return {
    state,
    loading,
    results,
    total: results.length,
    facets,
    active,
    // pagination (numbered)
    page,
    pageCount,
    pageItems,
    setPage: (n) => update({ page: n }, { resetPage: false }),
    // progressive loading ("load more")
    shownItems,
    hasMore: visible < results.length,
    loadingMore,
    loadMore: () => {
      setLoadingMore(true);
      window.clearTimeout(loadingTimer.current);
      loadingTimer.current = window.setTimeout(() => {
        setVisible((v) => v + pageSize);
        setLoadingMore(false);
      }, 500);
    },
    // setters
    setTab: (tab) => update({ tab }),
    setSearch: (search) => update({ search }),
    setSort: (sort) => update({ sort }),
    setCategory: (slug) => update({ categories: slug ? [slug] : [] }),
    toggleCategory: toggleIn("categories"),
    toggleGrade: toggleIn("grades"),
    toggleItemType: toggleIn("itemTypes"),
    setPrice: (price) => update({ price }),
    setEnding: (ending) => update({ ending }),
    setInStock: (inStock) => update({ inStock }),
    setDiscounted: (discounted) => update({ discounted }),
    removeFilter,
    clearAll,
  };
}
