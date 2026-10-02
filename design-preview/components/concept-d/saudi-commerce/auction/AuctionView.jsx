"use client";

// Option 4 — Contemporary Saudi Commerce: Auction Detail. Practical and
// ordered: a cream band carries the breadcrumb, title, seller and grade
// (like Browse's cream search band); below, the gallery and the lot's
// sections run beside a framed bid panel that stays in view (sage head,
// red clock, green Place bid, Buy Now under a rule); three sage blocks for
// condition, seller and delivery, the description and tables, the bid
// history and terms, the manifest and similar auctions. Phones: a short
// panel under the gallery, a white bid bar and the full form in a sheet.
import Link from "next/link";
import { Heart, Share2 } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { useAuctionDetail, useLotInfo, useShareLink } from "@/components/shared/auction/hooks";
import { useSaveToggle } from "@/components/shared/r3/home";
import { Arrow, GradePill } from "../ui";
import { BidPanel, BidSheet, PhoneBar } from "./Bidding";
import { ConfirmBid, ConfirmBuyNow, GradeGuide } from "./Dialogs";
import { Gallery } from "./Gallery";
import { AboutLot, HistoryTable, InfoBlocks, ManifestTable, Similar, TermsList } from "./LotSections";

function Breadcrumbs({ info }) {
  const { ui } = useLang();
  const { link } = useConcept();
  return (
    <nav aria-label={ui("breadcrumb")}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 sc-sm text-[var(--sc-muted)]">
        {info.crumbs.map((crumb, i) => (
          <li key={crumb.key} className="flex min-w-0 items-center gap-2">
            {i > 0 ? (
              <span aria-hidden="true">
                <Arrow className="size-3.5" />
              </span>
            ) : null}
            {crumb.href ? (
              <Link href={link(crumb.href)} className="sc-link text-[var(--sc-link)]">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="max-w-[18rem] truncate text-[var(--sc-ink)]">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const FRAMED = "inline-flex h-11 items-center justify-center gap-2 rounded-[7px] border border-[var(--sc-line)] bg-white px-4 sc-md font-semibold text-[var(--sc-ink)] transition-colors hover:border-[var(--sc-green)]";

/** Save to the watchlist (heart), framed like Share beside it. */
function SaveButton({ product }) {
  const { ui } = useLang();
  const { saved, toggle, label } = useSaveToggle(product);
  return (
    <button type="button" onClick={toggle} aria-pressed={saved} aria-label={label} className={FRAMED} data-testid="watch-button">
      <Heart aria-hidden="true" className={saved ? "size-5 fill-[var(--sc-green)] text-[var(--sc-green)]" : "size-5"} strokeWidth={1.8} />
      <span className="hidden sm:inline">{saved ? ui("watching") : ui("watch")}</span>
    </button>
  );
}

/** Cream band: breadcrumb, sale tag and lot number, title, seller and grade, Save and Share. */
function LotBand({ detail, info }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const share = useShareLink();
  const { product, auction, dual } = detail;
  return (
    <section aria-labelledby="sc-lot-title" className="border-b border-[var(--sc-line)] bg-[var(--sc-cream)]/55">
      <div className="sc-container pb-6 pt-5 dt:pb-7 dt:pt-6">
        <Breadcrumbs info={info} />
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 sc-md text-[var(--sc-muted)]">
              <span className="inline-flex h-[26px] items-center rounded-[6px] bg-[var(--sc-green)] px-2.5 sc-sm font-semibold text-white">{dual ? t(C.auctionAndBuyNow) : ui("timedAuction")}</span>
              {info.quantity ? <span className="inline-flex h-[26px] items-center rounded-[6px] bg-white px-2.5 sc-sm font-semibold text-[var(--sc-ink)]">{info.quantity}</span> : null}
              <span>
                {ui("lotNumber")}{" "}
                <span dir="ltr" className="font-semibold text-[var(--sc-ink)] tabular">
                  {product.lot}
                </span>
              </span>
            </p>
            <h1 id="sc-lot-title" className="mt-3 sc-lot-title text-[var(--sc-ink)] text-balance">
              {info.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 sc-md text-[var(--sc-muted)]">
              {info.seller ? (
                <span>
                  {ui("soldBy")}{" "}
                  <Link href={link(info.sellerHref)} className="sc-link font-medium text-[var(--sc-link)]">
                    {info.sellerName}
                  </Link>
                </span>
              ) : null}
              <span className="inline-flex items-center gap-2">
                <GradePill grade={product.grade} />
                <button type="button" onClick={detail.guide.show} className="sc-link font-medium text-[var(--sc-link)]">
                  {ui("whatGradeMeans")}
                </button>
              </span>
              <span>{info.typeLine}</span>
              <span>{pl("watching", auction.watchers)}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <SaveButton product={product} />
            <button type="button" onClick={share} className={FRAMED} data-testid="share-button">
              <Share2 aria-hidden="true" className="size-[18px]" strokeWidth={1.9} />
              {ui("share")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AuctionView({ product }) {
  const detail = useAuctionDetail(product);
  const info = useLotInfo(product);

  return (
    <>
      <LotBand detail={detail} info={info} />

      <div className="sc-container pt-6 dt:pt-8">
        {/* phone: gallery · summary · sections · tablet and desktop: [gallery, sections | panel in view] */}
        <div className="grid gap-x-8 gap-y-8 [grid-template-areas:'gallery'_'summary'_'sections'] md:grid-cols-[minmax(0,1fr)_330px] md:[grid-template-areas:'gallery_panel'_'sections_panel'] dt:grid-cols-[minmax(0,1fr)_400px] dt:gap-x-10">
          <div className="min-w-0 [grid-area:gallery]">
            <Gallery product={product} title={info.title} />
          </div>
          <div className="min-w-0 [grid-area:summary] md:hidden">
            <BidPanel detail={detail} compact />
          </div>
          <aside className="hidden min-w-0 [grid-area:panel] md:block">
            <div className="md:sticky md:top-[calc(var(--pbar-h)+20px)]">
              <BidPanel detail={detail} />
            </div>
          </aside>
          <div className="grid min-w-0 content-start gap-10 [grid-area:sections]">
            <InfoBlocks detail={detail} info={info} />
            <AboutLot detail={detail} info={info} />
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
              <HistoryTable auction={detail.auction} />
              <TermsList product={product} />
            </div>
            {product.palletContents ? <ManifestTable product={product} /> : null}
          </div>
        </div>
      </div>

      <Similar product={product} />

      <PhoneBar detail={detail} />
      <BidSheet detail={detail} info={info} />
      <ConfirmBid detail={detail} />
      {detail.dual ? <ConfirmBuyNow detail={detail} /> : null}
      <GradeGuide detail={detail} />
    </>
  );
}
