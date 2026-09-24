"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

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

  // useBrowse adopts the URL once on mount. After that, only navigations
  // (header tabs, palette, footer links landing on this same page) change
  // these params in ways the state doesn't already reflect.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const b = latest.current;
    if (["all", "auction", "buy_now"].includes(tab) && tab !== b.state.tab) b.setTab(tab);
    if (search !== b.state.search) b.setSearch(search);
    const current = b.state.categories.join(",");
    if (category !== current) b.setCategory(category.split(",")[0] || null);
  }, [tab, search, category]);

  return null;
}

/** Keeps a mounted Browse page in step with same-page navigations. */
export function UrlSync({ browse }) {
  return (
    <Suspense fallback={null}>
      <Sync browse={browse} />
    </Suspense>
  );
}
