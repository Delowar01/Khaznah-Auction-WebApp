"use client";

// Browse-aware navigation. The browse engine reads its filters from the URL
// once, when it mounts. Links that point at /browse while the visitor is
// already on it therefore update the URL in place and announce the change,
// so the browse view can remount with the new filters (no full reload).
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";

export const BROWSE_NAV_EVENT = "kb:browse-nav";

function useIsOnBrowse() {
  const pathname = usePathname();
  const { link } = useConcept();
  return pathname === link("/browse");
}

function announce(target) {
  window.history.pushState(null, "", target);
  window.dispatchEvent(new Event(BROWSE_NAV_EVENT));
  window.scrollTo({ top: 0 });
}

/** Programmatic navigation that understands in-place browse updates. */
export function useBrowseNavigate() {
  const router = useRouter();
  const { link } = useConcept();
  const onBrowse = useIsOnBrowse();
  return useCallback(
    (path) => {
      const target = link(path);
      if (onBrowse && path.startsWith("/browse")) announce(target);
      else router.push(target);
    },
    [link, onBrowse, router],
  );
}

/** <Link> to a browse URL (e.g. "/browse?tab=auction"), relative to the concept. */
export function BrowseLink({ href, onClick, children, ...props }) {
  const { link } = useConcept();
  const onBrowse = useIsOnBrowse();
  const target = link(href);
  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (onBrowse) {
      event.preventDefault();
      announce(target);
    }
  };
  return (
    <Link href={target} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

/** Copies the current page URL and confirms with a toast. */
export function useShareLink() {
  const { toast } = useStore();
  const { ui } = useLang();
  return useCallback(
    async (title) => {
      try {
        await navigator.clipboard?.writeText(window.location.href);
      } catch {
        // Clipboard can be blocked (permissions, insecure context); the toast still confirms the action.
      }
      toast({ tone: "success", title: title || ui("linkCopied") });
    },
    [toast, ui],
  );
}
