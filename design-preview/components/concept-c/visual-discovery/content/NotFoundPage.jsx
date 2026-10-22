"use client";

// Option 3's branded 404 for every unknown customer address (production
// shows Next's plain English page): rendered by concept-c/not-found.js when
// a page calls notFound(), and by app/global-not-found.js (through
// Option3NotFound) for addresses that match no route. Addresses production
// links to but does not have stay unsupported — /orders/1 (the checkout
// placeholder's "Track Order"), /account/orders/{id} (notification links),
// unknown seller codes — nothing is invented behind them.
import Link from "next/link";
import { useId } from "react";
import { usePathname } from "next/navigation";
import { Gavel, Layers, Radio, ShoppingBag } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { NOT_FOUND_COPY as N } from "@/components/shared/commerce/contentCopy";
import { COPY } from "../copy";
import { VDPage } from "../kit/Page";
import { Arrow, btn, cx } from "../ui";

const PLACES = [
  { key: "timed", icon: Gavel, label: COPY.navTimed, href: "/browse?tab=auction" },
  { key: "live", icon: Radio, label: COPY.navLive, href: "/live-auction" },
  { key: "buy", icon: ShoppingBag, label: COPY.navBuyNow, href: "/browse?tab=buy_now" },
  { key: "bulk", icon: Layers, label: COPY.navBulk, href: "/browse?category=bulk-pallets" },
];

export function NotFoundBody({ headingLevel = 1, container = true, showAddress = true }) {
  const { t } = useLang();
  const { link, base } = useConcept();
  const pathname = usePathname() || "";
  const placesId = useId();
  const Heading = `h${headingLevel}`;
  // The address as a customer would see it (without the preview's /en/concept-c prefix).
  const address = pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname;
  return (
    <div className={cx(container && "vd-container py-10 dt:py-16")} data-testid="not-found">
      <div className="mx-auto grid max-w-5xl items-center gap-6 rounded-[24px] bg-[var(--vd-ivory)] px-6 py-10 sm:px-10 md:grid-cols-[auto_minmax(0,1fr)] md:gap-12 dt:px-16 dt:py-16">
        <p aria-hidden="true" dir="ltr" className="vd-display text-[88px] font-extrabold leading-none tracking-[-0.04em] text-[var(--vd-indigo)] tabular md:text-[132px] dt:text-[160px]">
          404
        </p>
        <div className="min-w-0">
          <p className="vd-kicker text-[var(--vd-indigo)]">{t(N.kicker)}</p>
          <Heading className="mt-2 vd-title-page text-[var(--vd-ink)]">{t(N.title)}</Heading>
          <p className="mt-3 max-w-xl vd-lg text-[var(--vd-ink)]/85">{t(N.text)}</p>
          {showAddress && address && address !== "/" ? (
            <p className="mt-4 flex min-w-0 flex-wrap items-center gap-2 vd-sm text-[var(--vd-muted)]">
              {t(N.address)}
              <bdi dir="ltr" className="min-w-0 break-all rounded-full bg-white px-3 py-1 font-mono vd-sm text-[var(--vd-ink)]">
                {address}
              </bdi>
            </p>
          ) : null}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={link("/")} className={btn("indigo", "lg", "px-7")}>
              {t(N.home)}
            </Link>
            <Link href={link("/browse")} className={btn("outline", "lg", "px-7")}>
              {t(N.browseAll)}
            </Link>
          </div>
        </div>
      </div>
      <nav aria-labelledby={placesId} className="mx-auto mt-8 max-w-5xl">
        <h2 id={placesId} className="vd-h3 text-[var(--vd-ink)]">
          {t(N.popular)}
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {PLACES.map((place) => (
            <li key={place.key}>
              <Link href={link(place.href)} className="group flex h-full items-center gap-3 rounded-[20px] border border-[var(--vd-line)] bg-white p-4 transition-colors hover:border-[var(--vd-indigo)]">
                <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--vd-bluegray)] text-[var(--vd-indigo)]">
                  <place.icon className="size-[18px]" strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1 vd-md font-semibold text-[var(--vd-ink)]">{t(place.label)}</span>
                <Arrow className="size-4 text-[var(--vd-indigo)]" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link href={link("/contact")} className="vd-link inline-flex items-center gap-2 vd-md font-bold text-[var(--vd-indigo)]">
            {t(N.help)}
            <Arrow className="size-4" />
          </Link>
        </p>
      </nav>
    </div>
  );
}

export function VisualDiscoveryNotFound() {
  return (
    <VDPage>
      <NotFoundBody />
    </VDPage>
  );
}
