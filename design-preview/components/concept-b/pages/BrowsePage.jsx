"use client";

import { BrowseRoute } from "@/components/shared/browse/BrowseRoute";
import { BrowseFallback, BrowseView } from "../browse/BrowseView";

/**
 * Browse starts from the URL's parameters and keeps the address bar (and the
 * header's current shopping mode) in step. In-page navigation that lands on
 * Browse — header search, mega menu, category links, back / forward —
 * remounts the view with the new URL (see BrowseRoute).
 */
export function BrowsePage() {
  return <BrowseRoute fallback={<BrowseFallback />} view={BrowseView} />;
}
