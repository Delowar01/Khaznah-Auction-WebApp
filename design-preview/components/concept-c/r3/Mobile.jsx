"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { useOverlay } from "@/components/shared/ui/useOverlay";
import { Logo } from "@/components/shared/brand/Logo";
import { COPY } from "./copy";
import { RailContent } from "./Rail";
import { ScopeTabs, SearchBox } from "./Search";
import { useHub } from "./state";
import { Count, IconButton } from "./ui";

/** Full-screen layer below the presentation bar (menu and search sheet). */
function Layer({ open, onClose, title, children }) {
  const { t } = useLang();
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const panelRef = useOverlay(open, onClose);
  useEffect(() => {
    // Portals need the DOM; render nothing on the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="layer"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="fixed inset-x-0 bottom-0 top-pbar z-[190] flex flex-col bg-bg font-sans text-fg outline-none"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line px-4">
            <div className="flex items-center gap-3">
              <Logo variant="mark" decorative className="h-7 w-auto" />
              <h2 id={titleId} className="hb-h2">
                {title}
              </h2>
            </div>
            <IconButton label={t(COPY.close)} onClick={onClose} className="-me-2 border border-line bg-surface">
              <X aria-hidden="true" className="size-5" />
            </IconButton>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

/** Phones and tablets: the dedicated bottom command bar — Menu · Search · Cart. */
export function CommandBar() {
  const { t } = useLang();
  const { cartCount } = useStore();
  const { open, layer } = useHub();
  return (
    <nav aria-label={t(COPY.commandBar)} className="hb-cmdbar fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 shadow-[0_-12px_30px_-22px_rgb(0_0_0/0.45)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex h-16 max-w-3xl items-center gap-2 px-3">
        <button type="button" onClick={() => open("menu")} aria-expanded={layer === "menu"} className="flex h-12 w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-[10px] text-fg hover:bg-surface-2">
          <Menu aria-hidden="true" className="size-5" />
          <span className="hb-2xs font-semibold">{t(COPY.menu)}</span>
        </button>
        <button
          type="button"
          onClick={() => open("search")}
          aria-expanded={layer === "search"}
          className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-[10px] border border-line-strong bg-bg px-3.5 text-start hb-sm text-fg-3"
        >
          <Search aria-hidden="true" className="size-[18px] shrink-0 text-fg-2" />
          <span className="truncate">{t(COPY.searchPlaceholder)}</span>
        </button>
        <button type="button" onClick={() => open("cart")} aria-label={t(COPY.cartCount, { n: cartCount })} className="relative flex h-12 w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-[10px] text-fg hover:bg-surface-2">
          <span className="relative">
            <ShoppingCart aria-hidden="true" className="size-5" />
            <Count n={cartCount} className="-end-2.5 -top-2" />
          </span>
          <span aria-hidden="true" className="hb-2xs font-semibold">
            {t(COPY.cart)}
          </span>
        </button>
      </div>
    </nav>
  );
}

export function HubMenu() {
  const { t } = useLang();
  const { layer, close } = useHub();
  return (
    <Layer open={layer === "menu"} onClose={close} title={t(COPY.menu)}>
      <div className="px-3 pb-10">
        <RailContent onNavigate={close} inMenu />
      </div>
    </Layer>
  );
}

export function SearchSheet() {
  const { t } = useLang();
  const { layer, close } = useHub();
  return (
    <Layer open={layer === "search"} onClose={close} title={t(COPY.searchShort)}>
      <div className="grid gap-3 p-4">
        <ScopeTabs />
        <SearchBox variant="sheet" onDone={close} autoFocus />
      </div>
    </Layer>
  );
}
