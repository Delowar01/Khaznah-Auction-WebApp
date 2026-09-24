"use client";

import { useState } from "react";
import { Gavel } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { getCategory } from "@/data/categories";
import { isAuction } from "@/data/products";
import { AUCTION_POLICY } from "@/data/site";
import { openAuctions, relatedProducts } from "@/lib/catalog";
import { useAuction } from "@/lib/useAuction";
import { LotRail } from "../cards/LotRail";
import { DetailLayout } from "../product/DetailLayout";
import { Gallery } from "../product/Gallery";
import { GradeGuideModal } from "../product/GradeGuide";
import { LotDetails } from "../product/LotDetails";
import { LotHead } from "../product/LotHead";
import { ManifestTable } from "../product/ManifestTable";
import { SpecsTable } from "../product/SpecsTable";
import { Badge } from "../ui/Badge";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { COPY } from "../copy";
import { AuctionTerms } from "./AuctionTerms";
import { ConfirmBidModal, ConfirmBuyNowModal } from "./AuctionDialogs";
import { BidBox } from "./BidBox";
import { BidHistory } from "./BidHistory";
import { PhaseBadge } from "./AuctionClock";
import { BidSheet, MobileBidBar } from "./MobileBid";

function similarAuctions(product) {
  const related = relatedProducts(product, 30).filter((p) => isAuction(p) && p.status !== "sold");
  const extra = openAuctions().filter((p) => p.slug !== product.slug && !related.includes(p));
  return [...related, ...extra].slice(0, 10);
}

/** Auction detail: gallery · facts · sticky bid box, then history, terms, manifest, similar lots. */
export function AuctionView({ product }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const { toast } = useStore();
  const [bought, setBought] = useState(false);
  const live = useAuction(product, { simulateRivals: !bought });
  const auction = bought ? { ...live, phase: "sold", ended: true, buyNowAvailable: false } : live;
  const [confirm, setConfirm] = useState(null);
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [guide, setGuide] = useState(false);
  const category = getCategory(product.category);

  const requestBid = (amount) => {
    setSheet(false);
    setConfirm(amount);
  };

  const confirmBid = () => {
    const result = live.placeBid(confirm);
    setConfirm(null);
    if (!result.ok) toast({ tone: "warning", title: ui("placeBid"), description: result.error });
  };

  const confirmBuyNow = () => {
    setBuyNowOpen(false);
    setBought(true);
    toast({ tone: "success", title: t(COPY.boughtTitle), description: t(COPY.boughtText, { hours: AUCTION_POLICY.paymentWindowHours }) });
  };

  const badges = product.quantity ? (
    <Badge tone="tag-ink" size="md">
      {t(product.itemType === "pallet" ? COPY.fullPallet : COPY.carton, { units: pl("units", product.quantity) })}
    </Badge>
  ) : null;

  return (
    <div className="kb-container pb-16 pt-4">
      <Breadcrumbs
        items={[
          { label: ui("home"), href: link("/") },
          { label: ui("auctions"), href: link("/browse?tab=auction") },
          { label: t(category.name), href: link(`/browse?category=${category.slug}`) },
          { label: t(product.title) },
        ]}
      />

      <DetailLayout
        gallery={<Gallery product={product} badges={badges} />}
        head={
          <LotHead
            product={product}
            watchers={auction.watchers}
            onGradeGuide={() => setGuide(true)}
            status={
              <span className="ms-1 inline-flex items-center gap-1.5">
                <PhaseBadge phase={auction.phase} size="sm" />
                {product.saleType === "both" ? <Badge tone="accent">{t(COPY.auctionAndBuyNow)}</Badge> : null}
              </span>
            }
          />
        }
        details={
          <LotDetails
            product={product}
            afterHighlights={
              <section aria-labelledby="kb-specs">
                <h2 id="kb-specs" className="mb-2 kb-eyebrow text-fg-3">
                  {ui("specifications")}
                </h2>
                <SpecsTable specs={product.specs} />
                <p className="mt-3 kb-sm text-fg-2 text-pretty">{t(product.description)}</p>
              </section>
            }
          />
        }
        box={
          <BidBox
            product={product}
            auction={auction}
            bought={bought}
            onRequestBid={requestBid}
            onBuyNow={() => setBuyNowOpen(true)}
          />
        }
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <BidHistory auction={auction} />
        <AuctionTerms product={product} />
      </div>

      {product.palletContents ? (
        <div className="mt-8">
          <ManifestTable product={product} caption={ui("palletContents")} />
        </div>
      ) : null}

      <LotRail anchor="similar-auctions" className="mt-14" icon={Gavel} title={ui("similarAuctions")} products={similarAuctions(product)} href="/browse?tab=auction" />

      <MobileBidBar product={product} auction={auction} onOpen={() => setSheet(true)} />
      <BidSheet open={sheet} onClose={() => setSheet(false)} product={product} auction={auction} onRequestBid={requestBid} />
      <ConfirmBidModal open={confirm != null} amount={confirm} product={product} auction={auction} onCancel={() => setConfirm(null)} onConfirm={confirmBid} />
      {product.saleType === "both" ? (
        <ConfirmBuyNowModal open={buyNowOpen} product={product} onCancel={() => setBuyNowOpen(false)} onConfirm={confirmBuyNow} />
      ) : null}
      <GradeGuideModal open={guide} onClose={() => setGuide(false)} highlight={product.grade} />
    </div>
  );
}
