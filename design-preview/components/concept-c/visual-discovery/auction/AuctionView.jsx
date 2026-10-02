"use client";

// Option 3 — Visual Discovery: Auction Detail. Image-forward and bright:
// the photograph large on its tinted plate with the coral clock on it,
// beside status chips, a display title and a rounded bid card (Buy Now a
// soft row beneath); then the lot's story with fact chips and highlight
// tiles, condition and specifications, the seller on navy with delivery
// tiles, the bid history as a timeline beside the terms, the manifest as
// photo tiles and discovery-led similar auctions. Phones: a short bid card,
// a floating navy pill bar and the full form in a sheet.
import Link from "next/link";
import { Share2 } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { useAuctionDetail, useLotInfo, usePhaseLabel, useShareLink } from "@/components/shared/auction/hooks";
import { GradePill, cx } from "../ui";
import { BidCard, BidSheet, BuyNowRow, PhoneBar } from "./Bidding";
import { ConfirmBid, ConfirmBuyNow, GradeGuide } from "./Dialogs";
import { Gallery } from "./Gallery";
import { AboutLot, HistoryTimeline, ManifestTiles, SellerDelivery, SimilarDiscovery, TermsPanel } from "./LotSections";

const DOT = { live: "bg-[#2f9e5b]", urgent: "bg-[var(--vd-coral)]", critical: "bg-[var(--vd-live)]", upcoming: "bg-[var(--vd-indigo)]", ended: "bg-[var(--vd-muted)]", sold: "bg-[var(--vd-muted)]" };

function Breadcrumbs({ info }) {
  const { ui } = useLang();
  const { link } = useConcept();
  return (
    <nav aria-label={ui("breadcrumb")}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 vd-sm text-[var(--vd-muted)]">
        {info.crumbs.map((crumb, i) => (
          <li key={crumb.key} className={cx("flex min-w-0 items-center gap-2", !crumb.href && "max-w-[18rem]")}>
            {i > 0 ? <span aria-hidden="true">·</span> : null}
            {crumb.href ? (
              <Link href={link(crumb.href)} className="vd-link hover:text-[var(--vd-indigo)]">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="truncate font-semibold text-[var(--vd-ink)]">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Status and sale chips, the display title, grade and seller. */
function Identity({ detail, info }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const share = useShareLink();
  const { product, auction, dual } = detail;
  const phase = usePhaseLabel(auction.phase);
  return (
    <div className="min-w-0">
      <ul className="flex flex-wrap items-center gap-2">
        <li className="inline-flex h-8 items-center gap-2 rounded-full border border-[var(--vd-line)] bg-white px-3 vd-sm font-semibold text-[var(--vd-ink)]">
          <span aria-hidden="true" className={cx("size-2 rounded-full", DOT[auction.phase] || DOT.live)} />
          {phase}
        </li>
        <li className="inline-flex h-8 items-center rounded-full bg-[var(--vd-bluegray)] px-3 vd-sm font-semibold text-[var(--vd-indigo)]">{dual ? t(C.auctionAndBuyNow) : ui("timedAuction")}</li>
        {info.quantity ? <li className="inline-flex h-8 items-center rounded-full bg-[var(--vd-ivory)] px-3 vd-sm font-semibold text-[var(--vd-ink)]">{info.quantity}</li> : null}
        <li className="inline-flex h-8 items-center rounded-full border border-[var(--vd-line)] px-3 vd-sm text-[var(--vd-muted)]">
          {ui("lotNumber")}&nbsp;
          <span dir="ltr" className="font-semibold text-[var(--vd-ink)] tabular">
            {product.lot}
          </span>
        </li>
      </ul>
      <h1 className="mt-4 vd-lot-title text-[var(--vd-ink)] text-balance">{info.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2.5">
        {info.seller ? (
          <Link href={link(info.sellerHref)} className="group inline-flex items-center gap-2.5">
            <span aria-hidden="true" className="grid size-9 place-items-center rounded-full text-[12px] font-bold text-white" style={{ background: info.seller.tone }}>
              {info.seller.monogram}
            </span>
            <span className="vd-md">
              <span className="block vd-xs text-[var(--vd-muted)]">{ui("soldBy")}</span>
              <span className="font-bold text-[var(--vd-ink)] group-hover:underline">{info.sellerName}</span>
            </span>
          </Link>
        ) : null}
        <span className="vd-sm text-[var(--vd-muted)]">{pl("watching", auction.watchers)}</span>
        <button type="button" onClick={share} className="ms-auto inline-flex h-10 items-center gap-2 rounded-full border border-[var(--vd-line)] bg-white px-4 vd-md font-semibold text-[var(--vd-indigo)] transition-colors hover:bg-[var(--vd-bluegray)]" data-testid="share-button">
          <Share2 aria-hidden="true" className="size-4" strokeWidth={2.2} />
          {ui("share")}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <GradePill grade={product.grade} />
        <button type="button" onClick={detail.guide.show} className="vd-link vd-md font-semibold text-[var(--vd-indigo)]">
          {ui("whatGradeMeans")}
        </button>
        <span className="vd-sm text-[var(--vd-muted)]">{info.typeLine}</span>
      </div>
    </div>
  );
}

export function AuctionView({ product }) {
  const detail = useAuctionDetail(product);
  const info = useLotInfo(product);

  return (
    <>
      <div className="vd-container pt-5 dt:pt-7">
        <Breadcrumbs info={info} />
      </div>

      {/* phone: gallery · identity · bid · tablet and desktop: [gallery | identity, bid] */}
      <div className="vd-container mt-5 grid gap-x-8 gap-y-6 [grid-template-areas:'gallery'_'identity'_'bid'] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:grid-rows-[auto_1fr] md:[grid-template-areas:'gallery_identity'_'gallery_bid'] dt:mt-6 dt:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] dt:gap-x-12">
        <div className="min-w-0 [grid-area:gallery]">
          <Gallery product={product} auction={detail.auction} title={info.title} />
        </div>
        <div className="min-w-0 [grid-area:identity]">
          <Identity detail={detail} info={info} />
        </div>
        <div className="grid min-w-0 content-start gap-3 [grid-area:bid]">
          <div className="md:hidden">
            <BidCard detail={detail} compact />
          </div>
          <div className="hidden md:block">
            <BidCard detail={detail} />
          </div>
          {detail.dual ? <BuyNowRow detail={detail} /> : null}
        </div>
      </div>

      <AboutLot detail={detail} info={info} />
      <SellerDelivery detail={detail} info={info} />

      <div className="vd-container mt-12 grid gap-8 dt:mt-16 dt:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] dt:gap-12">
        <HistoryTimeline auction={detail.auction} />
        <TermsPanel product={product} />
      </div>

      {product.palletContents ? <ManifestTiles product={product} /> : null}
      <SimilarDiscovery product={product} info={info} />

      <PhoneBar detail={detail} />
      <BidSheet detail={detail} info={info} />
      <ConfirmBid detail={detail} />
      {detail.dual ? <ConfirmBuyNow detail={detail} /> : null}
      <GradeGuide detail={detail} />
    </>
  );
}
