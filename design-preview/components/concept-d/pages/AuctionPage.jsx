"use client";

import { useState } from "react";
import { Boxes } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { getProduct } from "@/data/products";
import { ITEM_TYPES } from "@/data/grades";
import { Container } from "../ui/Layout";
import { StatusChip, OverlayChip } from "../ui/Chips";
import { GradeButton } from "../product/GradeButton";
import { useInView } from "../lib/hooks";
import { useCopy } from "../lib/useCopy";
import { useLot } from "../market/MarketProvider";
import { auctionChip } from "../cards/useLotView";
import { DetailHeader } from "../product/DetailHeader";
import { Gallery } from "../product/Gallery";
import { RelatedRail } from "../product/RelatedRail";
import { BidTerminal } from "../auction/BidTerminal";
import { UpcomingTerminal, ClosedTerminal } from "../auction/StaticTerminals";
import { BidConfirmModal } from "../auction/BidConfirm";
import { AuctionTabs } from "../auction/AuctionTabs";
import { BidSheet } from "../auction/BidSheet";

export function AuctionPage({ slug }) {
  const product = getProduct(slug);
  const auction = useLot(slug);
  const { t, ui } = useLang();
  const { toast } = useStore();
  const c = useCopy();
  const [purchased, setPurchased] = useState(false);
  const [confirmAmount, setConfirmAmount] = useState(null);
  const [ctaRef, ctaInView] = useInView({ rootMargin: "0px 0px -40px 0px" });
  const running = !purchased && ["live", "urgent", "critical"].includes(auction.phase);
  const chip = purchased ? "sold" : auctionChip(auction.phase);

  const chips = (
    <>
      <StatusChip status={chip} />
      {product.saleType === "both" ? <StatusChip status="buyNow" label={`${ui("auction")} + ${ui("buyNow")}`} /> : null}
      <GradeButton grade={product.grade} />
      {product.itemType !== "single" ? (
        <span className="d-label inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-fg-2 ring-1 ring-inset ring-line-strong">
          <Boxes aria-hidden="true" className="size-3.5" />
          {t(ITEM_TYPES[product.itemType])}
        </span>
      ) : null}
    </>
  );

  const terminal = purchased || auction.phase === "sold" || auction.phase === "ended" ? (
    <ClosedTerminal product={product} auction={auction} purchased={purchased} />
  ) : auction.phase === "upcoming" ? (
    <UpcomingTerminal product={product} auction={auction} />
  ) : (
    <BidTerminal
      ref={ctaRef}
      product={product}
      auction={auction}
      onReview={setConfirmAmount}
      onPurchase={() => {
        setPurchased(true);
        toast({ tone: "success", title: c("purchasedTitle"), description: c("purchasedToast") });
      }}
    />
  );

  return (
    <>
      <Container>
        <DetailHeader product={product} chips={chips} />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_424px] xl:gap-12">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <Gallery images={product.images} title={t(product.title)} overlay={<OverlayChip status={chip} />} />
          </div>
          <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="d-terminal-sticky">{terminal}</div>
          </div>
          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <AuctionTabs product={product} auction={auction} />
          </div>
        </div>
        <div id="similar" className="scroll-mt-40">
          <RelatedRail product={product} title={ui("similarAuctions")} eyebrow={ui("auctions")} preferAuctions />
        </div>
      </Container>

      <BidConfirmModal open={confirmAmount != null} onClose={() => setConfirmAmount(null)} product={product} auction={auction} amount={confirmAmount ?? 0} />
      {running ? <BidSheet product={product} auction={auction} show={!ctaInView} /> : null}
      <div aria-hidden="true" className="h-24 lg:hidden" />
    </>
  );
}
