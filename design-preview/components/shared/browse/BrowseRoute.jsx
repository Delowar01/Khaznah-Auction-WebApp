"use client";

// Keeps a Browse view and the address bar in step, for every option.
//
// The view starts from the URL's parameters and writes its state back with
// history.replaceState(null, …), which Next.js also applies to its router, so
// useSearchParams (and the header's current shopping mode) follow in-page
// changes. A navigation that lands on Browse while it is open (header modes,
// search, footer links, back / forward) produces parameters the view did not
// write; the view then remounts from the new URL.
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BROWSE_DEFAULTS, browseKey, browseSearch, browseStateFromParams } from "@/lib/useBrowse";

/**
 * The shopping mode a Browse state stands for, as the headers name them:
 * timed auctions, Buy Now or bulk pallets (null for anything broader).
 */
export function navKeyOf(state) {
  if (state.tab === "auction") return "timed";
  if (state.tab === "buy_now") return "buy";
  if (state.categories.length === 1 && state.categories[0] === "bulk-pallets") return "bulk";
  return null;
}

function Route({ onNav, view: View, viewProps }) {
  const params = useSearchParams();
  const query = params.toString();
  const urlState = useMemo(() => ({ ...BROWSE_DEFAULTS, ...browseStateFromParams(new URLSearchParams(query)) }), [query]);
  const urlKey = browseKey(urlState);
  const nav = navKeyOf(urlState);
  // What the view last wrote (or the URL it started from).
  const written = useRef(urlKey);
  const [mount, setMount] = useState(() => ({ key: 0, initial: urlState }));

  useEffect(() => {
    onNav?.(nav);
  }, [nav, onNav]);

  useEffect(() => {
    if (urlKey === written.current) return;
    written.current = urlKey;
    // A navigation the view did not make: start again from the new URL.
    setMount((current) => ({ key: current.key + 1, initial: urlState }));
  }, [urlKey, urlState]);

  const onState = useCallback((state) => {
    const key = browseKey(state);
    if (key === written.current) return;
    written.current = key;
    const { pathname, search, hash } = window.location;
    window.history.replaceState(null, "", `${pathname}${browseSearch(state, search)}${hash}`);
  }, []);

  return <View key={mount.key} initial={mount.initial} onState={onState} {...viewProps} />;
}

/**
 * Renders `view` once the URL is known, with `initial` (the URL's state, for
 * useBrowse with syncUrl: false) and `onState` (to call with the browse state
 * after every change; see useReportState). `onNav` receives the current
 * shopping mode for the header. The static export has no query string, so
 * `fallback` is what the page shows until the browser takes over.
 */
export function BrowseRoute({ fallback = null, onNav, view, viewProps }) {
  return (
    <Suspense fallback={fallback}>
      <Route onNav={onNav} view={view} viewProps={viewProps} />
    </Suspense>
  );
}

/** Reports a view's state to its BrowseRoute after every change. */
export function useReportState(state, onState) {
  useEffect(() => {
    onState(state);
  }, [state, onState]);
}
