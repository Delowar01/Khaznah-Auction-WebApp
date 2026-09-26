"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Gavel, Heart, ShoppingCart, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Drawer } from "@/components/shared/ui/Drawer";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { getProduct, isAuction } from "@/data/products";
import { getSeller, CITIES } from "@/data/sellers";
import { GRADES } from "@/data/grades";
import { AUCTION_POLICY, DEMO_USER } from "@/data/site";
import { detailPath, discountPercent } from "@/lib/catalog";
import { useRemaining } from "@/lib/clock";
import { formatDuration, moneyText } from "@/lib/format";
import { COPY } from "./copy";
import { useHub, useHubLot } from "./state";
import { GradeTag, IconButton, btnClass, cx } from "./ui";

function Fact({ label, children }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2">
      <dt className="hb-sm text-fg-3">{label}</dt>
      <dd className="text-end hb-sm font-semibold text-fg">{children}</dd>
    </div>
  );
}

function AuctionPanel({ product }) {
  const { t, ui, pl, lang } = useLang();
  const { placeBid } = useHub();
  const { currentBid, bidCount, minNext, leading } = useHubLot(product);
  const remaining = useRemaining(product.status === "scheduled" ? product.startsIn : product.endsIn);
  const [confirming, setConfirming] = useState(false);

  if (product.status === "sold") {
    return <p className="rounded-[10px] bg-surface-2 px-4 py-3 hb-md font-semibold">{t(COPY.soldFor, { amount: moneyText(product.currentBid) })}</p>;
  }
  if (product.status === "scheduled") {
    return (
      <dl className="divide-y divide-line rounded-[10px] border border-line px-4">
        <Fact label={t(COPY.upcoming)}>
          <span dir={lang === "ar" ? "rtl" : "ltr"}>{t(COPY.opens, { time: formatDuration(remaining ?? 0, lang) })}</span>
        </Fact>
        <Fact label={ui("startingBid")}>
          <Money value={product.startingBid} />
        </Fact>
      </dl>
    );
  }

  const urgent = remaining != null && remaining <= 3600;
  return (
    <div className="grid gap-3">
      <dl className="divide-y divide-line rounded-[10px] border border-line px-4">
        <Fact label={ui("currentBid")}>
          <Money value={currentBid} className="hb-lg font-bold" /> <span className="ms-1 hb-xs font-normal text-fg-3">{pl("bids", bidCount)}</span>
        </Fact>
        <Fact label={ui("closesIn")}>
          <span dir={lang === "ar" ? "rtl" : "ltr"} className={cx("hb-num", urgent ? "text-live" : "")}>
            {formatDuration(remaining ?? 0, lang)}
          </span>
        </Fact>
        <Fact label={ui("nextMinBid")}>
          <Money value={minNext} />
        </Fact>
      </dl>
      {leading ? <p className="rounded-[8px] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] px-3 py-2 hb-sm font-semibold text-success">{t(COPY.youLead, { amount: moneyText(currentBid) })}</p> : null}
      <p className="hb-xs text-fg-3">{t(COPY.depositLine, { amount: moneyText(AUCTION_POLICY.depositAmount), wallet: moneyText(DEMO_USER.walletBalance) })}</p>
      {confirming ? (
        <div role="group" aria-label={t(COPY.confirmTitle)} className="rounded-[10px] border-2 border-primary p-4 kz-fade-up">
          <p className="hb-md font-semibold">{t(COPY.confirmTitle)}</p>
          <p className="mt-1 hb-sm text-fg-2">{t(COPY.confirmText, { amount: moneyText(minNext), title: t(product.title) })}</p>
          <p className="mt-1 hb-xs text-fg-3">{ui("bindingBid")}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              data-autofocus
              onClick={() => {
                placeBid(product.slug, minNext);
                setConfirming(false);
              }}
              className={btnClass("primary", "md", "flex-1")}
            >
              {ui("confirmBid")}
            </button>
            <button type="button" onClick={() => setConfirming(false)} className={btnClass("secondary", "md")}>
              {ui("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} className={btnClass("primary", "lg", "w-full")}>
          <Gavel aria-hidden="true" className="size-4" />
          {t(COPY.bidN, { amount: moneyText(minNext) })}
        </button>
      )}
    </div>
  );
}

function BuyPanel({ product }) {
  const { t, ui } = useLang();
  const { addToCart, toast } = useStore();
  const pct = discountPercent(product);
  const soldOut = product.stock <= 0;
  return (
    <div className="grid gap-3">
      <dl className="divide-y divide-line rounded-[10px] border border-line px-4">
        <Fact label={ui("price")}>
          <span className="inline-flex items-baseline gap-2">
            {pct > 0 ? <Money value={product.originalPrice} strike className="hb-xs font-normal text-fg-3" /> : null}
            <Money value={product.price} className="hb-lg font-bold" />
          </span>
        </Fact>
        {pct > 0 ? (
          <Fact label={t(COPY.deals)}>
            <span dir="ltr" className="text-[var(--hb-deal)]">
              −{pct}%
            </span>
          </Fact>
        ) : null}
        <Fact label={ui("availability")}>{soldOut ? t(COPY.soldOut) : t(COPY.inStock, { n: product.stock })}</Fact>
      </dl>
      <p className="hb-xs text-fg-3">{ui("deliveryText")}</p>
      <button
        type="button"
        disabled={soldOut}
        onClick={() => {
          addToCart(product.slug, 1);
          toast({ tone: "success", title: t(COPY.addedToCart), description: t(product.title) });
        }}
        className={btnClass("primary", "lg", "w-full")}
      >
        <ShoppingCart aria-hidden="true" className="size-4" />
        {soldOut ? t(COPY.soldOut) : t(COPY.addToCart)}
      </button>
    </div>
  );
}

function QuickBody({ product, onClose }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { isWatched, toggleWatch, toast } = useStore();
  const seller = getSeller(product.seller);
  const watched = isWatched(product.slug);
  const image = product.images[0];
  return (
    <>
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line px-4">
        <p className="hb-eyebrow text-fg-3">{t(COPY.quickView)}</p>
        <IconButton label={t(COPY.close)} onClick={onClose} className="-me-2">
          <X aria-hidden="true" className="size-5" />
        </IconButton>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] border border-line bg-plate">
          <Img
            image={image}
            alt={t(product.title)}
            sizes="400px"
            className={cx("size-full", image?.kind === "scene" ? "object-cover" : "object-contain p-[8%] mix-blend-multiply")}
          />
          <GradeTag grade={product.grade} long className="absolute start-2.5 top-2.5 bg-surface" />
        </div>
        <h2 className="mt-4 hb-lg font-semibold text-fg">{t(product.title)}</h2>
        <p className="mt-1 hb-sm text-fg-3">
          {GRADES[product.grade] ? t(GRADES[product.grade].text) : null}
        </p>
        {seller ? (
          <Link href={link(`/seller/${seller.code}`)} onClick={onClose} className="mt-2 inline-flex items-center gap-2 hb-sm text-fg-2 hover:text-fg">
            <span aria-hidden="true" className="grid size-6 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: `color-mix(in oklab, ${seller.tone} 80%, black)` }}>
              {seller.monogram}
            </span>
            {t(seller.name)} · {t(CITIES[seller.city])}
          </Link>
        ) : null}
        <div className="mt-4">{isAuction(product) ? <AuctionPanel product={product} /> : <BuyPanel product={product} />}</div>
      </div>
      <div className="flex shrink-0 items-center gap-2 border-t border-line p-4">
        <button
          type="button"
          aria-pressed={watched}
          onClick={() => {
            const now = toggleWatch(product.slug);
            toast({ tone: now ? "success" : "neutral", title: now ? ui("addedToWatchlist") : ui("removedFromWatchlist"), description: t(product.title) });
          }}
          className={btnClass("secondary", "md")}
        >
          <Heart aria-hidden="true" className={cx("size-4", watched ? "fill-live text-live" : "")} />
          {watched ? t(COPY.watchingOn) : t(COPY.watch)}
        </button>
        <Link href={link(detailPath(product))} onClick={onClose} className={btnClass("ghost", "md", "ms-auto")}>
          {t(COPY.openFullPage)}
          <ArrowUpRight aria-hidden="true" className="flip-rtl size-4" />
        </Link>
      </div>
    </>
  );
}

/** Quick view: a side panel with the lot summary and its Bid (confirm step) or Add action. */
export function QuickView() {
  const { t } = useLang();
  const { quick, lastQuick, closeQuick } = useHub();
  const product = getProduct(quick || lastQuick || "");
  return (
    <Drawer
      open={Boolean(quick)}
      onClose={closeQuick}
      title={product ? `${t(COPY.quickView)}: ${t(product.title)}` : t(COPY.quickView)}
      side="end"
      panelClassName="bg-elevated font-sans text-fg shadow-overlay sm:w-[420px]"
    >
      {product ? <QuickBody key={product.slug} product={product} onClose={closeQuick} /> : null}
    </Drawer>
  );
}
