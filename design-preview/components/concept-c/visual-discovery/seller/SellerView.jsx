"use client";

// Option 3 — Seller storefront (production /seller/[code]). As in
// production, the storefront is Browse scoped to one seller's warehouse
// (inventory B.6): the approved Option 3 Browse — pill bar, filters drawer,
// image-led cards, Load more — under a seller hero. The hero keeps
// production's fixed headline and "Seller · CODE" chip and shows only fields
// of the public seller lookup (name, city, member since, counts, live now);
// nothing the API does not provide (no ratings, reviews, followers, badges,
// cover photos or profile text). Sale modes follow the seller's package
// entitlements; the live row shows for every seller, as production's Live
// tab does (it reads `live_auctions`, which the lookup never sends — a
// preserved quirk).
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, Gavel, MapPin, Radio, ShoppingBag } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { BrowseRoute, useReportState } from "@/components/shared/browse/BrowseRoute";
import { BROWSE_COPY as BC } from "@/components/shared/browse/copy";
import { useLiveDestination } from "@/components/shared/browse/hooks";
import { SELLER_COPY as C } from "@/components/shared/commerce/sellerCopy";
import { CITIES } from "@/data/sellers";
import { LIVE_EVENT } from "@/data/live";
import { sellerStats } from "@/lib/catalog";
import { formatMonthYear } from "@/lib/format";
import { useBrowse } from "@/lib/useBrowse";
import { BrowseFallback, BrowseSheets, LoadMore, PillBar, Results } from "../browse/BrowseView";
import { ActivePills, ViewSwitch } from "../browse/Controls";
import { Breadcrumbs, ErrorState } from "../kit/Blocks";
import { VDPage } from "../kit/Page";
import { Arrow, btn } from "../ui";

/** The sale modes a seller's package includes ("All" only when there is more than one). */
export function sellerModes(entitlements) {
  const modes = [];
  if (entitlements?.auctions !== false) modes.push("auction");
  if (entitlements?.buyNow !== false) modes.push("buy_now");
  return modes.length > 1 ? ["all", ...modes] : modes;
}

const initialsOf = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

function Fact({ icon: Icon, children }) {
  return (
    <li className="inline-flex items-center gap-2 vd-md text-white/85">
      <Icon aria-hidden="true" className="size-4 shrink-0 text-[var(--vd-gold)]" strokeWidth={2} />
      {children}
    </li>
  );
}

function SellerHero({ seller }) {
  const { t, lang } = useLang();
  const stats = sellerStats(seller.code);
  return (
    <div className="vd-container pt-6 dt:pt-8">
      <Breadcrumbs items={[{ label: t(seller.name) }]} />
      <section aria-labelledby="seller-title" className="relative mt-4 overflow-hidden rounded-[24px] bg-[var(--vd-navy)] px-5 py-7 text-white sm:px-8 sm:py-9 dt:mt-5 dt:px-12 dt:py-12">
        <span aria-hidden="true" className="absolute -end-16 -top-20 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(225_169_50/0.28),transparent)]" />
        <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-7 items-center rounded-full bg-white/10 px-3 vd-kicker text-[var(--vd-gold)]">{t(C.marketplace)}</span>
              <span className="inline-flex h-7 items-center rounded-full border border-white/20 px-3 vd-xs font-bold uppercase tracking-[0.1em] text-white/85 rtl:normal-case rtl:tracking-normal" data-testid="seller-chip">
                {t(C.sellerChip)}
                {" · "}
                <span dir="ltr">{seller.code}</span>
              </span>
              {seller.liveNow ? (
                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[var(--vd-live)] px-3 vd-xs font-bold">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-white" />
                  {t(C.liveNow)}
                </span>
              ) : null}
            </p>
            <h1 id="seller-title" className="mt-4 vd-page-title text-white">
              {t(C.headline)}
            </h1>
            <p className="mt-3 vd-h3 !text-[20px] !leading-7 text-white">{t(seller.name)}</p>
            <ul aria-label={t(C.facts)} className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              <Fact icon={MapPin}>{t(C.city, { city: t(CITIES[seller.city]) })}</Fact>
              <Fact icon={CalendarDays}>{t(C.since, { date: formatMonthYear(seller.memberSince, lang) })}</Fact>
            </ul>
          </div>
          <div className="flex items-center gap-4 md:flex-col md:items-end">
            <span aria-hidden="true" className="hidden size-24 place-items-center rounded-full bg-white vd-display text-[30px] font-extrabold text-[var(--vd-navy)] shadow-[0_0_0_6px_rgb(225_169_50/0.25)] md:grid">
              {initialsOf(seller.name.en)}
            </span>
            <dl className="grid grid-cols-2 gap-3">
              {[
                { icon: Gavel, label: t(C.auctions), value: stats.activeAuctions },
                { icon: ShoppingBag, label: t(C.buyNow), value: stats.buyNowCount },
              ].map((stat) => (
                <div key={stat.label} className="rounded-[18px] bg-white/[0.08] px-4 py-3">
                  <dt className="flex items-center gap-1.5 vd-xs text-white/75">
                    <stat.icon aria-hidden="true" className="size-3.5" strokeWidth={2.2} />
                    {stat.label}
                  </dt>
                  <dd className="mt-0.5 vd-h3 !text-[24px] !leading-8 text-white tabular">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Live auctions: the seller's live sale when it is on, otherwise production's empty line. */
function LiveRow({ seller }) {
  const { t } = useLang();
  const { link } = useConcept();
  const live = useLiveDestination();
  const hosting = seller.liveNow && LIVE_EVENT.host === seller.code;
  return (
    <section aria-label={t(C.liveTitle)} className="vd-container mt-5 dt:mt-6">
      {hosting ? (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[20px] bg-[var(--vd-ivory)] px-5 py-4 sm:px-6">
          <span className="inline-flex h-8 shrink-0 items-center gap-2 rounded-full bg-[var(--vd-live)] px-3.5 vd-sm font-bold uppercase tracking-[0.04em] text-white rtl:normal-case rtl:tracking-normal">
            <span aria-hidden="true" className="size-2 rounded-full bg-white" />
            {t(BC.liveNow)}
          </span>
          <p className="min-w-0 flex-1 basis-56 vd-h3 !text-[17px] !leading-6 text-[var(--vd-ink)]">{live.title}</p>
          <Link href={link(live.href)} className={btn("indigo", "lg", "h-11 gap-2 px-5 max-sm:w-full")}>
            {t(C.joinLive)}
            <Arrow className="size-4" />
          </Link>
        </div>
      ) : (
        <p className="flex items-center gap-2.5 rounded-[20px] bg-[#f6f8fc] px-5 py-3.5 vd-md text-[var(--vd-muted)]">
          <Radio aria-hidden="true" className="size-4 shrink-0 text-[var(--vd-indigo)]" strokeWidth={2.2} />
          {t(C.noLive)}
        </p>
      )}
    </section>
  );
}

function SellerView({ initial, onState, seller }) {
  const { t } = useLang();
  const modes = sellerModes(seller.entitlements);
  // Never start on a mode the seller does not offer (production's clampTab).
  const start = { ...initial, tab: modes.includes(initial.tab ?? "all") ? (initial.tab ?? "all") : modes[0] };
  const browse = useBrowse({ sellerCode: seller.code, pageSize: 12, initial: start, syncUrl: false });
  useReportState(browse.state, onState);
  const [view, setView] = useState("grid");
  const [sheet, setSheet] = useState(null);
  const open = (name) => setSheet({ name, side: name === "filters" && window.matchMedia("(min-width: 768px)").matches ? "end" : "bottom" });
  const close = () => setSheet(null);
  return (
    <>
      <SellerHero seller={seller} />
      <LiveRow seller={seller} />
      <PillBar browse={browse} view={view} onView={setView} onOpen={open} modes={modes} />
      <section aria-labelledby="seller-results-title" aria-busy={browse.loading} className="vd-container pb-14 pt-5 dt:pb-20 dt:pt-6">
        <h2 id="seller-results-title" className="sr-only">
          {t(C.listings, { name: t(seller.name) })}
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-3 max-dt:mb-5">
          <ActivePills browse={browse} className="dt:mb-5" />
          <ViewSwitch view={view} onChange={setView} className="ms-auto dt:hidden" />
        </div>
        <Results browse={browse} view={view} />
        <LoadMore browse={browse} />
      </section>
      <BrowseSheets browse={browse} sheet={sheet} close={close} />
    </>
  );
}

/** Production's seller error boundary: no unfiltered fallback; retry or browse everything. */
function SellerError() {
  const { t } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  return (
    <div className="vd-container py-14 dt:py-20">
      <ErrorState
        headingLevel={1}
        title={t(C.errorTitle)}
        text={t(C.errorText)}
        retryLabel={t(C.retry)}
        onRetry={() => router.replace(window.location.pathname)}
        actions={
          <Link href={link("/browse")} className={btn("outline", "lg")}>
            {t(C.browseAll)}
          </Link>
        }
      />
    </div>
  );
}

/** The preview's error state replaces the catalogue (production's error.js boundary). */
function SellerSwitch({ initial, onState, seller }) {
  const params = useSearchParams();
  if (params.get("state") === "error") return <SellerError />;
  return <SellerView initial={initial} onState={onState} seller={seller} />;
}

/** Option 3 — Seller storefront. `seller`: the looked-up seller (unknown codes 404 before this renders). */
export function VisualDiscoverySeller({ seller }) {
  return (
    <VDPage active="sellers" newsletter>
      <BrowseRoute fallback={<BrowseFallback />} view={SellerSwitch} viewProps={{ seller }} />
    </VDPage>
  );
}
