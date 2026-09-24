"use client";

import { useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { UI } from "@/data/ui";
import { getCategory, getProduct, isAuction, relatedProducts } from "@/lib/catalog";
import { useAuction } from "@/lib/useAuction";
import { COPY } from "../copy";
import { Gallery } from "../product/Gallery";
import { ConditionNote, LotHeader } from "../product/LotHeader";
import { Description, SellerMiniCard, SpecTable } from "../product/DetailBlocks";
import { DeliveryBlock } from "../product/DeliveryBlock";
import { Manifest } from "../product/Manifest";
import { DetailLayout, RelatedBand } from "../product/DetailLayout";
import { BidPanel } from "../auction/BidPanel";
import { BuyNowBox } from "../auction/BuyNowBox";
import { ResultPanel, UpcomingPanel } from "../auction/StatePanels";
import { BidHistory, AuctionTerms } from "../auction/BidHistory";
import { ConfirmBidModal } from "../auction/ConfirmBidModal";
import { MobileBidBar } from "../auction/MobileBidBar";
import { Badge } from "../ui/Badges";
import { ShareButton } from "../ui/Misc";
import { WatchButton } from "../ui/WatchButton";

export function AuctionPage({ slug }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const product = getProduct(slug);
  const auction = useAuction(product);
  const [confirm, setConfirm] = useState(null);
  const category = getCategory(product.category);
  const similar = relatedProducts(product, 12)
    .filter((p) => isAuction(p) && p.status === "live")
    .slice(0, 4);
  const { phase } = auction;
  const open = phase === "live" || phase === "urgent" || phase === "critical";

  const panel =
    phase === "upcoming" ? (
      <UpcomingPanel product={product} auction={auction} />
    ) : open ? (
      <BidPanel product={product} auction={auction} onRequestBid={setConfirm} />
    ) : (
      <ResultPanel auction={auction} />
    );

  const overlay =
    phase === "sold" ? (
      <span className="absolute bottom-4 end-16 sm:bottom-5 sm:end-20">
        <Badge tone="night" dia>
          {ui("sold")}
        </Badge>
      </span>
    ) : null;

  return (
    <div>
      <DetailLayout
        breadcrumbs={[
          { label: ui("home"), href: link("/") },
          { label: ui("auctions"), href: link("/browse?tab=auction") },
          { label: t(category?.name), href: link(`/browse?category=${product.category}`) },
          { label: t(product.title) },
        ]}
        gallery={<Gallery images={product.images} title={t(product.title)} overlay={overlay} />}
        aside={
          <>
            <LotHeader
              product={product}
              actions={
                <>
                  <WatchButton product={product} variant="full" size="sm" testId="watch-button" />
                  <ShareButton size="sm" description={t(product.title)} />
                </>
              }
            />
            <ConditionNote product={product} />
            <div className="c-sticky-aside--tall mt-8 space-y-4">
              {panel}
              {auction.buyNowAvailable ? <BuyNowBox product={product} /> : null}
              <SellerMiniCard code={product.seller} />
            </div>
          </>
        }
        details={
          <>
            {phase !== "upcoming" ? <BidHistory auction={auction} /> : null}
            <Manifest product={product} />
            <Description product={product} />
            <SpecTable product={product} />
            <AuctionTerms />
            <DeliveryBlock product={product} />
          </>
        }
      />
      <div id="similar" className="scroll-mt-28">
        <RelatedBand title={UI.similarAuctions} eyebrow={COPY.endingEyebrow} products={similar} />
      </div>
      <MobileBidBar product={product} auction={auction} onRequestBid={setConfirm} />
      <ConfirmBidModal amount={confirm} onClose={() => setConfirm(null)} product={product} auction={auction} />
    </div>
  );
}
