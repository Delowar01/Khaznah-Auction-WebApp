"use client";

import { useRef, useState } from "react";
import { notFound } from "next/navigation";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { getCategory, getProduct, relatedProducts } from "@/lib/catalog";
import { useAuction } from "@/lib/useAuction";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { StatusLabel } from "../ui/Status";
import { ShareButton, WatchButton } from "../ui/Actions";
import { useOffscreen } from "../ui/StickyBar";
import { Gallery } from "../detail/Gallery";
import { LotHeading } from "../detail/LotHeading";
import { LotStory, StoryBlock } from "../detail/LotStory";
import { RelatedRail } from "../detail/RelatedRail";
import { GradeGuideModal } from "../detail/GradeGuideModal";
import { LiveBidBox } from "../auction/LiveBidBox";
import { AuctionOutcome, UpcomingBox } from "../auction/AuctionOutcome";
import { BidHistory } from "../auction/BidHistory";
import { MobileBidBar } from "../auction/MobileBidBar";
import { ConfirmBidModal, ConfirmBuyNowModal } from "../auction/ConfirmModals";
import { COPY } from "../copy";

const OPEN_PHASES = ["live", "urgent", "critical"];

export function AuctionPage({ slug }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { toast } = useStore();
  const product = getProduct(slug);
  if (!product) notFound();

  const [purchased, setPurchased] = useState(false);
  const a = useAuction(product, { simulateRivals: !purchased });
  const [guideOpen, setGuideOpen] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, amount: 0, done: null });
  const [buyOpen, setBuyOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const formRef = useRef(null);
  const formOffscreen = useOffscreen(formRef);

  const open = !purchased && OPEN_PHASES.includes(a.phase);
  const upcoming = !purchased && a.phase === "upcoming";
  const category = getCategory(product.category);
  const status = purchased ? "sold" : a.phase;

  const requestConfirm = (amount, done) => {
    setSheetOpen(false);
    setConfirm({ open: true, amount, done });
  };
  const buyNow = () => {
    setPurchased(true);
    toast({ tone: "success", title: t(COPY.boughtTitle), description: t(COPY.boughtText) });
  };

  return (
    <div className="pb-24 lg:pb-0">
      <div className="mx-auto max-w-[1360px] px-5 pt-6 sm:px-6 lg:px-10 lg:pt-8">
        <Breadcrumbs
          items={[
            { label: ui("home"), href: link("/") },
            { label: ui("auctions"), href: link("/browse?tab=auction") },
            { label: t(category?.name), href: link(`/browse?tab=auction&category=${product.category}`) },
            { label: t(product.title) },
          ]}
        />
      </div>

      <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-10 px-5 pb-16 pt-6 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-10 lg:pb-24">
        <div className="min-w-0 lg:col-span-7">
          <div className="lg:sticky lg:top-[calc(var(--pbar-h)+100px)]">
            <Gallery images={product.images} title={t(product.title)} />
          </div>
        </div>

        <div className="min-w-0 space-y-6 lg:col-span-5">
          <LotHeading product={product} onGradeGuide={() => setGuideOpen(true)} status={<StatusLabel status={status} />} />
          <div className="flex items-center gap-6">
            <WatchButton slug={product.slug} variant="text" testId="watch-button" />
            <ShareButton />
          </div>

          {open ? (
            <LiveBidBox product={product} a={a} onRequestConfirm={requestConfirm} onBuyNow={() => setBuyOpen(true)} formRef={formRef} />
          ) : upcoming ? (
            <UpcomingBox product={product} a={a} formRef={formRef} />
          ) : (
            <AuctionOutcome product={product} a={a} purchased={purchased} />
          )}
        </div>
      </div>

      <LotStory product={product} onGradeGuide={() => setGuideOpen(true)}>
        {!upcoming ? (
          <StoryBlock title={ui("bidHistory")}>
            <BidHistory history={a.history} />
          </StoryBlock>
        ) : null}
        <StoryBlock title={ui("auctionTerms")}>
          <ol className="space-y-3">
            {COPY.termsList.map((term, i) => (
              <li key={i} className="flex gap-4 text-[15px] leading-relaxed text-fg-2 rtl:leading-7">
                <span dir="ltr" className="a-serif w-6 shrink-0 text-[20px] leading-6 text-auction tabular">
                  {i + 1}
                </span>
                <span>{t(term)}</span>
              </li>
            ))}
          </ol>
        </StoryBlock>
      </LotStory>

      <RelatedRail
        eyebrow={t(COPY.closingSoon)}
        title={ui("similarAuctions")}
        products={relatedProducts(product, 4)}
        href={link("/browse?tab=auction")}
        linkLabel={t(COPY.viewAllAuctions)}
      />

      <MobileBidBar
        product={product}
        a={a}
        live={open}
        show={formOffscreen && (open || upcoming)}
        sheetOpen={sheetOpen}
        setSheetOpen={setSheetOpen}
        onRequestConfirm={requestConfirm}
      />
      <ConfirmBidModal
        open={confirm.open}
        amount={confirm.amount}
        product={product}
        a={a}
        onDone={confirm.done}
        onClose={() => setConfirm((c) => ({ ...c, open: false }))}
      />
      {product.saleType === "both" ? <ConfirmBuyNowModal open={buyOpen} onClose={() => setBuyOpen(false)} product={product} onConfirm={buyNow} /> : null}
      <GradeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} highlight={product.grade} />
    </div>
  );
}
