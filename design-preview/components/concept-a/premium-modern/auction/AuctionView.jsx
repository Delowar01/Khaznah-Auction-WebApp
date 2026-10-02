"use client";

// Option 2 — Premium Modern: Auction Detail. Editorial and warm: a large
// gallery on stone beside a brass-dash eyebrow, the title and a charcoal
// bid panel (Buy Now a quiet line beneath it); then a stone band about the
// lot, bid history beside seller, delivery and terms, the manifest and four
// similar auctions. Phones: gallery, title, a short charcoal summary, the
// ivory bid bar and the full form in a sheet.
import Link from "next/link";
import { Share2 } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { useAuctionDetail, useLotInfo, usePhaseLabel, useShareLink } from "@/components/shared/auction/hooks";
import { GradePill, btn, cx } from "../ui";
import { BidPanel, BidSheet, BuyNowLine, ClockLine, PhoneBar, SaveSquare } from "./Bidding";
import { ConfirmBid, ConfirmBuyNow, GradeGuide } from "./Dialogs";
import { Gallery } from "./Gallery";
import { AboutBand, HistoryBlock, Manifest, SideNotes, Similar } from "./LotSections";

function Breadcrumbs({ info }) {
  const { ui } = useLang();
  const { link } = useConcept();
  return (
    <nav aria-label={ui("breadcrumb")}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 pr-xs text-fg-2">
        {info.crumbs.map((crumb, i) => (
          <li key={crumb.key} className={cx("flex min-w-0 items-center gap-2", !crumb.href && "max-w-[18rem]")}>
            {i > 0 ? (
              <span aria-hidden="true" className="text-[#b9b4aa]">
                /
              </span>
            ) : null}
            {crumb.href ? (
              <Link href={link(crumb.href)} className="pr-link">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="truncate text-fg">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Eyebrow, H1, seller and grade: the lot's identity. */
function Identity({ detail, info }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { product, dual } = detail;
  return (
    <div className="min-w-0">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span aria-hidden="true" className="pr-dash" />
        <span className="pr-eyebrow text-[#4a4d57]">{dual ? t(C.auctionAndBuyNow) : ui("timedAuction")}</span>
        <span className="pr-xs text-fg-2">
          {ui("lotNumber")}{" "}
          <span dir="ltr" className="tabular">
            {product.lot}
          </span>
        </span>
      </p>
      <h1 className="mt-3 pr-lot-title text-fg text-balance">{info.title}</h1>
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 pr-md text-fg-2">
        {info.seller ? (
          <span>
            {ui("soldBy")}{" "}
            <Link href={link(info.sellerHref)} className="pr-link font-medium text-[var(--pr-bronze)]">
              {info.sellerName}
            </Link>
          </span>
        ) : null}
        <span>{info.quantity || info.typeLine}</span>
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <GradePill grade={product.grade} />
        <button type="button" onClick={detail.guide.show} className="pr-link pr-md font-medium text-[var(--pr-bronze)]">
          {ui("whatGradeMeans")}
        </button>
      </div>
    </div>
  );
}

/** Status, red clock, watchers, then Save and Share. */
function StatusRow({ detail }) {
  const { ui, pl } = useLang();
  const share = useShareLink();
  const { auction, product } = detail;
  const phase = usePhaseLabel(auction.phase);
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-y border-line py-3">
      <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
        <p className="inline-flex items-center gap-2 pr-md font-semibold text-fg">
          <span aria-hidden="true" className={cx("size-2 rounded-full", detail.closed ? "bg-[#9b968c]" : detail.upcoming ? "bg-[var(--pr-brass)]" : "bg-[var(--pr-grade-a)]")} />
          {phase}
        </p>
        {detail.closed ? null : <ClockLine auction={auction} className="pr-md" />}
        <p className="pr-sm text-fg-2">{pl("watching", auction.watchers)}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <SaveSquare product={product} />
        <button type="button" onClick={share} className={btn("outline", "md", "w-11 px-0")} aria-label={ui("share")} title={ui("share")} data-testid="share-button">
          <Share2 aria-hidden="true" className="size-[18px]" strokeWidth={1.7} />
        </button>
      </div>
    </div>
  );
}

export function AuctionView({ product }) {
  const detail = useAuctionDetail(product);
  const info = useLotInfo(product);

  return (
    <>
      <div className="pr-container pt-5 dt:pt-7">
        <Breadcrumbs info={info} />
      </div>

      {/* phone: gallery · identity · status · summary · Buy Now
          tablet: identity over [gallery | status + panel + Buy Now]
          desktop: [gallery | identity, status, panel, Buy Now] */}
      <div className="pr-container mt-5 grid gap-x-8 gap-y-6 [grid-template-areas:'gallery'_'identity'_'bid'] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:[grid-template-areas:'identity_identity'_'gallery_bid'] dt:mt-7 dt:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] dt:gap-x-14 dt:[grid-template-areas:'gallery_identity'_'gallery_bid'] dt:grid-rows-[auto_1fr]">
        <div className="min-w-0 [grid-area:gallery]">
          <Gallery product={product} title={info.title} />
        </div>
        <div className="min-w-0 [grid-area:identity]">
          <Identity detail={detail} info={info} />
        </div>
        <div className="grid min-w-0 content-start gap-5 [grid-area:bid]">
          <StatusRow detail={detail} />
          <div className="md:hidden">
            <BidPanel detail={detail} compact />
          </div>
          <div className="hidden md:block">
            <BidPanel detail={detail} />
          </div>
          {detail.dual ? <BuyNowLine detail={detail} /> : null}
        </div>
      </div>

      <AboutBand detail={detail} info={info} />

      <div className="pr-container grid gap-12 py-12 dt:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] dt:gap-16 dt:py-16">
        <HistoryBlock auction={detail.auction} />
        <SideNotes detail={detail} info={info} />
      </div>

      {product.palletContents ? <Manifest product={product} /> : null}
      <Similar product={product} />

      <PhoneBar detail={detail} />
      <BidSheet detail={detail} info={info} />
      <ConfirmBid detail={detail} />
      {detail.dual ? <ConfirmBuyNow detail={detail} /> : null}
      <GradeGuide detail={detail} />
    </>
  );
}
