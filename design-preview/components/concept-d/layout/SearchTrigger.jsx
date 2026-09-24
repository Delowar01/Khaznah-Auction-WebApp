"use client";

import { useEffect } from "react";
import { Search } from "lucide-react";
import { Kbd } from "../ui/Layout";
import { useCopy } from "../lib/useCopy";
import { useIsMac } from "../lib/hooks";
import { useChrome } from "./ChromeContext";

/** Command-search pill in the app bar; ⌘K / Ctrl K opens the palette anywhere. */
export function SearchTrigger() {
  const { openPalette } = useChrome();
  const c = useCopy();
  const isMac = useIsMac();

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openPalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openPalette]);

  return (
    <button
      type="button"
      onClick={openPalette}
      aria-haspopup="dialog"
      aria-keyshortcuts="Meta+K Control+K"
      className="group flex h-10 w-full max-w-[520px] items-center gap-3 rounded-full border border-line-strong bg-surface-2/70 ps-4 pe-2 text-start text-sm text-fg-3 shadow-[var(--d-highlight)] transition-[border-color,background-color] hover:border-fg-3/50 hover:bg-surface-2"
    >
      <Search aria-hidden="true" className="size-4 shrink-0 text-fg-2" />
      <span className="min-w-0 flex-1 truncate">{c("commandSearch")}</span>
      <span className="hidden items-center gap-1 lg:flex" aria-hidden="true">
        {isMac ? <Kbd>⌘K</Kbd> : <Kbd>{c("ctrlK")}</Kbd>}
      </span>
    </button>
  );
}
