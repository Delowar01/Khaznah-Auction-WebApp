"use client";

import { Suspense, useCallback, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, Gavel, LayoutGrid } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useDismiss } from "@/components/shared/ui/hooks";
import { LIVE_EVENT } from "@/data/live";
import { cx } from "../ui/cx";
import { BrowseLink } from "../utils/navigation";
import { COPY } from "../copy";
import { useChrome } from "./ChromeContext";
import { MegaMenu } from "./MegaMenu";

const LINKS = [
  { key: "live", href: "/live-auction", ui: "liveNow", live: true },
  { key: "auctions", href: "/browse?tab=auction", ui: "auctions", match: { tab: "auction" } },
  { key: "buy", href: "/browse?tab=buy_now", ui: "buyNow", match: { tab: "buy_now" } },
  { key: "ending", href: "/browse?ending=1h", ui: "endingSoon", match: { ending: "1h" } },
  { key: "bulk", href: "/browse?category=bulk-pallets", ui: "bulkLots", match: { category: "bulk-pallets" } },
  { key: "sellers", href: "/seller", ui: "sellers" },
];

const ITEM =
  "relative inline-flex h-11 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 kb-sm font-semibold text-fg-2 transition-colors hover:text-fg aria-[current=page]:text-primary aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-2.5 aria-[current=page]:after:bottom-0 aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-primary";

/** The Live entry is a standing indicator — a red pill with a pulsing dot and
 *  the sample live-event viewer count, so the auction floor is always visible. */
function LiveNavLink({ current }) {
  const { ui, pl } = useLang();
  const { link } = useConcept();
  return (
    <Link
      href={link("/live-auction")}
      aria-current={current ? "page" : undefined}
      className={cx(
        "inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 kb-sm font-bold ring-1 ring-inset transition-colors",
        current ? "kb-tag-live ring-transparent" : "kb-live-soft bg-live/10 ring-live/25 hover:bg-live/15",
      )}
    >
      <span aria-hidden="true" className={cx("kz-live-dot", current && "bg-white!")} />
      {ui("live")}
      <span aria-hidden="true" className="mx-0.5 h-3 w-px bg-current opacity-25" />
      <span className="tabular font-bold">{pl("viewers", LIVE_EVENT.viewers)}</span>
    </Link>
  );
}

function NavLinks({ params }) {
  const { ui } = useLang();
  const { link } = useConcept();
  const pathname = usePathname();
  const onBrowse = pathname === link("/browse");

  return LINKS.map((item) => {
    let current = false;
    if (item.match) current = onBrowse && Object.entries(item.match).every(([k, v]) => params?.get(k) === v);
    else current = pathname.startsWith(link(item.href));

    if (item.live) return <LiveNavLink key={item.key} current={current} />;

    const label = (
      <>
        {item.key === "auctions" ? <Gavel aria-hidden="true" className="size-4 text-accent" strokeWidth={2.25} /> : null}
        {ui(item.ui)}
      </>
    );
    return item.href.startsWith("/browse") ? (
      <BrowseLink key={item.key} href={item.href} aria-current={current ? "page" : undefined} className={ITEM}>
        {label}
      </BrowseLink>
    ) : (
      <Link key={item.key} href={link(item.href)} aria-current={current ? "page" : undefined} className={ITEM}>
        {label}
      </Link>
    );
  });
}

function NavLinksWithParams() {
  const params = useSearchParams();
  return <NavLinks params={params} />;
}

/** Tier 3 of the desktop header: "All categories" mega menu + shortcut links. */
export function CategoryNav({ collapsed }) {
  const { ui, t } = useLang();
  const { link } = useConcept();
  const { setPinned } = useChrome();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const panelId = useId();

  const close = useCallback(() => {
    setOpen(false);
    setPinned(false);
  }, [setPinned]);
  const toggle = () => {
    setOpen(!open);
    setPinned(!open);
  };
  useDismiss(open, close, ref);

  return (
    <nav
      ref={ref}
      aria-label={t(COPY.mainNav)}
      className={cx(
        "relative hidden border-b border-line bg-surface transition-transform duration-300 ease-out lg:block",
        collapsed ? "pointer-events-none -translate-y-full" : "pointer-events-auto",
      )}
    >
      <div className="kb-container flex h-11 items-center gap-1">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          onClick={toggle}
          className={cx(
            "inline-flex h-8 items-center gap-2 rounded-md px-3 kb-sm font-bold transition-colors",
            open ? "bg-primary text-on-primary" : "bg-primary/10 text-primary hover:bg-primary/15",
          )}
        >
          <LayoutGrid aria-hidden="true" className="size-4" />
          {ui("allCategories")}
          <ChevronDown aria-hidden="true" className={cx("size-4 transition-transform", open && "rotate-180")} />
        </button>
        <span aria-hidden="true" className="mx-2 h-5 w-px bg-line" />
        <Suspense fallback={<NavLinks params={null} />}>
          <NavLinksWithParams />
        </Suspense>
        <Link
          href={`${link("/")}#how-it-works`}
          className="ms-auto inline-flex h-11 items-center px-2.5 kb-sm font-medium text-fg-3 transition-colors hover:text-fg"
        >
          {ui("howItWorks")}
        </Link>
      </div>
      <MegaMenu open={open} id={panelId} onClose={close} />
    </nav>
  );
}
