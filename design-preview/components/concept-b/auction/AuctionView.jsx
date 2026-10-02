"use client";

// Option 1 — Modern Commerce: Auction Detail. A white lot band (breadcrumb,
// status, H1, grade, seller, Watch and Share) like Browse's summary band;
// then the gallery and a dense lot sheet beside the sticky bid panel (navy
// clock head, price and figures, bid form, maximum bid, notes, Buy Now set
// apart at the foot); description, seller and delivery, bid history and
// terms, the pallet manifest and similar auctions. Phones get a compact bid
// summary under the gallery, the fixed bid bar and the full form in a sheet.
import { Gavel } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { similarAuctions, useAuctionDetail, useLotInfo } from "@/components/shared/auction/hooks";
import { LotRail } from "../cards/LotRail";
import { Gallery } from "../product/Gallery";
import { GradeGuideModal } from "../product/GradeGuide";
import { ManifestTable } from "../product/ManifestTable";
import { AuctionHeader } from "./AuctionHeader";
import { AuctionTerms } from "./AuctionTerms";
import { ConfirmBidModal, ConfirmBuyNowModal } from "./AuctionDialogs";
import { BidBox } from "./BidBox";
import { BidHistory } from "./BidHistory";
import { LotAbout, LotFacts } from "./LotSheet";
import { BidSheet, MobileBidBar } from "./MobileBid";

const STICKY = "md:sticky md:top-[calc(var(--pbar-h)+var(--kb-head)+16px)] md:transition-[top] md:duration-300";

export function AuctionView({ product }) {
  const { ui } = useLang();
  const detail = useAuctionDetail(product);
  const info = useLotInfo(product);
  const { auction } = detail;

  return (
    <>
      <AuctionHeader detail={detail} info={info} />

      <div className="kb-container pb-16 pt-5 lg:pt-6">
        {/* phone: gallery → bid summary → facts → more · tablet: [gallery, facts, more | panel] ·
            desktop: [gallery | facts | panel] over [more | panel] */}
        <div className="grid gap-6 [grid-template-areas:'gallery'_'summary'_'facts'_'more'] md:grid-cols-[minmax(0,1fr)_320px] md:[grid-template-areas:'gallery_box'_'facts_box'_'more_box'] lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-8 xl:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_380px] xl:[grid-template-areas:'gallery_facts_box'_'more_more_box']">
          <div className="min-w-0 [grid-area:gallery]">
            <Gallery product={product} />
          </div>
          <div className="min-w-0 [grid-area:summary] md:hidden">
            <BidBox detail={detail} compact />
          </div>
          <div className="min-w-0 [grid-area:facts]">
            <LotFacts detail={detail} info={info} />
          </div>
          <aside className="hidden min-w-0 [grid-area:box] md:block">
            <div className={STICKY}>
              <BidBox detail={detail} />
            </div>
          </aside>
          <div className="grid min-w-0 content-start gap-6 [grid-area:more]">
            <LotAbout detail={detail} info={info} />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <BidHistory auction={auction} />
              <AuctionTerms product={product} />
            </div>
            {product.palletContents ? <ManifestTable product={product} caption={ui("palletContents")} /> : null}
          </div>
        </div>

        <LotRail anchor="similar-auctions" className="mt-14" icon={Gavel} title={ui("similarAuctions")} products={similarAuctions(product)} href="/browse?tab=auction" />
      </div>

      <MobileBidBar detail={detail} />
      <BidSheet detail={detail} />
      <ConfirmBidModal open={detail.confirm.open} amount={detail.confirm.amount} product={product} auction={auction} onCancel={detail.confirm.cancel} onConfirm={detail.confirm.accept} />
      {detail.dual ? <ConfirmBuyNowModal open={detail.buyNow.open} product={product} onCancel={detail.buyNow.cancel} onConfirm={detail.buyNow.accept} /> : null}
      <GradeGuideModal open={detail.guide.open} onClose={detail.guide.close} highlight={product.grade} />
    </>
  );
}
