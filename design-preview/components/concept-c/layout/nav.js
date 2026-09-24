"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { emitBrowseIntent, intentFromHref, isBrowsePath } from "../browse/browseIntent";

/** Which primary nav item a route belongs to. */
export function activeNavKey(pathname = "", search = "") {
  const rest = pathname.replace(/^\/(en|ar)\/concept-c/, "");
  if (rest.startsWith("/live-auction")) return "live";
  if (rest.startsWith("/seller")) return "sellers";
  if (rest.startsWith("/auction")) return "auctions";
  if (rest.startsWith("/product")) return "buy-now";
  if (rest.startsWith("/browse")) {
    const tab = new URLSearchParams(search).get("tab");
    return tab === "auction" ? "auctions" : tab === "buy_now" ? "buy-now" : null;
  }
  return null;
}

/** Active nav key; needs a <Suspense> boundary (reads search params). */
export function useActiveNav() {
  const pathname = usePathname();
  const params = useSearchParams();
  return activeNavKey(pathname, params.toString());
}

/**
 * Resolves data hrefs ("/browse?tab=auction", "#how-it-works") to concept
 * URLs, and returns a click handler that updates an open Browse page in place.
 */
export function useSiteLink() {
  const { base, link } = useConcept();
  const pathname = usePathname();
  const resolve = (href) => (href.startsWith("#") ? `${base}${href}` : link(href));
  const onNavigate = (href, after) => (event) => {
    if (href.startsWith("/browse") && isBrowsePath(pathname)) {
      event.preventDefault();
      emitBrowseIntent(intentFromHref(href));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    after?.();
  };
  return { resolve, onNavigate };
}
