"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

const TABS = ["all", "auction", "buy_now"];

function Sync({ browse }) {
  const params = useSearchParams();
  const tab = params.get("tab") || "all";
  const search = params.get("search") || params.get("q") || "";
  const category = params.get("category") || "";
  const latest = useRef(browse);
  const mounted = useRef(false);

  useEffect(() => {
    latest.current = browse;
  });

  // useBrowse adopts the URL on mount. Afterwards only navigations that land
  // on the same page (header tabs, search, footer links) change these values
  // in ways the browse state does not already reflect.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const b = latest.current;
    if (TABS.includes(tab) && tab !== b.state.tab) b.setTab(tab);
    if (search !== b.state.search) b.setSearch(search);
    if (category !== b.state.categories.join(",")) b.setCategory(category.split(",")[0] || null);
  }, [tab, search, category]);

  return null;
}

/** Keeps a mounted browse page in step with same-page navigations. */
export function BrowseUrlSync({ browse }) {
  return (
    <Suspense fallback={null}>
      <Sync browse={browse} />
    </Suspense>
  );
}
