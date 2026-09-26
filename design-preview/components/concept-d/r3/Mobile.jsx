"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ChevronUp, Search, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useOverlay } from "@/components/shared/ui/useOverlay";
import { Money } from "@/components/shared/ui/Money";
import { COPY } from "./copy";
import { SearchResults, Switcher } from "./Header";
import { useFloor } from "./state";
import { IconButton, LiveDot, btnClass, cx } from "./ui";

/** True once the live stage has scrolled out of view. */
function useStageGone() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const stage = document.getElementById("floor-live");
    if (!stage) return undefined;
    const io = new IntersectionObserver(([entry]) => setGone(!entry.isIntersecting), { rootMargin: "-120px 0px 0px 0px" });
    io.observe(stage);
    return () => io.disconnect();
  }, []);
  return gone;
}

/** Phones: the sticky floor switcher, plus a live strip once the stage has scrolled away. */
export function MobileBar({ live }) {
  const { t } = useLang();
  const { link } = useConcept();
  const gone = useStageGone();
  const item = live.current;
  return (
    <div className="sticky top-pbar z-30 border-b border-line bg-[color-mix(in_oklab,var(--bg)_95%,transparent)] backdrop-blur-md md:hidden">
      <div className="px-3 py-2">
        <Switcher live={live} mobile />
      </div>
      {gone && item ? (
        <div className="flex items-center gap-2 border-t border-line px-3 py-1.5 kz-fade-up">
          <LiveDot />
          <span className="ac-label text-accent">{t(COPY.segLive)}</span>
          <span className="min-w-0 flex-1 truncate ac-xs text-fg-2">
            {t(COPY.lotOf, { n: item.order, total: live.items.length })} · <Money value={item.currentBid} className="font-semibold text-fg" />
          </span>
          <Link href={link("/live-auction")} className={btnClass("urgent", "xs")}>
            {t(COPY.join)}
            <span className="sr-only">: {t(live.event.title)}</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

/** Phones: full-screen search whose suggestions lead with lots ending soonest. */
export function MobileSearch() {
  const { t } = useLang();
  const { layer, close } = useFloor();
  const open = layer === "search";
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("auction");
  const titleId = useId();
  const inputId = useId();
  const panelRef = useOverlay(open, close);
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
          key="search"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="fixed inset-x-0 bottom-0 top-pbar z-[190] flex flex-col bg-bg font-sans text-fg outline-none"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.22 }}
        >
          <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line px-4">
            <h2 id={titleId} className="ac-h3">
              {t(COPY.search)}
            </h2>
            <IconButton label={t(COPY.close)} onClick={close} className="-me-2">
              <X aria-hidden="true" className="size-5" />
            </IconButton>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="flex h-11 items-center gap-2 rounded-[10px] border border-fg bg-surface px-3">
              <label htmlFor={inputId} className="sr-only">
                {t(COPY.searchLabel)}
              </label>
              <Search aria-hidden="true" className="size-4 text-fg-3" />
              <input
                id={inputId}
                data-autofocus
                type="search"
                autoComplete="off"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t(COPY.searchPlaceholder)}
                className="ac-search min-w-0 flex-1 bg-transparent ac-sm outline-none placeholder:text-fg-3"
              />
            </div>
            <div role="radiogroup" aria-label={t(COPY.searchScope)} className="mt-3 flex gap-1.5">
              {[
                ["auction", COPY.scopeAuctions],
                ["buy_now", COPY.scopeBuyNow],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={scope === key}
                  onClick={() => setScope(key)}
                  className={cx("h-8 rounded-full border px-3.5 ac-sm font-semibold", scope === key ? "border-fg bg-fg text-bg" : "border-line-strong text-fg-2")}
                >
                  {t(label)}
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-[12px] border border-line bg-surface">
              <SearchResults query={query} scope={scope} onPick={close} />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

/** Phones: the floating My bids pill — only when you have bids here, never over the footer. */
export function MyBidsPill() {
  const { t } = useLang();
  const { bids, open, layer } = useFloor();
  const count = Object.keys(bids).length;
  const [footer, setFooter] = useState(false);
  useEffect(() => {
    const node = document.getElementById("floor-footer");
    if (!node) return undefined;
    const io = new IntersectionObserver(([entry]) => setFooter(entry.isIntersecting));
    io.observe(node);
    return () => io.disconnect();
  }, []);
  const show = count > 0 && !footer && !layer;
  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          key="pill"
          type="button"
          onClick={() => open("bids")}
          aria-label={`${t(COPY.openMyBids)} — ${t(COPY.pill, { n: count })}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-[max(14px,env(safe-area-inset-bottom))] start-1/2 z-40 inline-flex h-11 -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-4 ac-sm font-semibold text-on-primary shadow-overlay rtl:translate-x-1/2 md:hidden"
        >
          <span aria-hidden="true" className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 ac-2xs font-bold text-on-accent ac-num">
            {count}
          </span>
          {t(COPY.pill, { n: count })}
          <ChevronUp aria-hidden="true" className="size-4" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
