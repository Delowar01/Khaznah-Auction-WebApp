"use client";

import Link from "next/link";
import { Check, Gavel, Heart, ShoppingCart } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Modal } from "@/components/shared/ui/Modal";
import { Money } from "@/components/shared/ui/Money";
import { getProduct } from "@/data/products";
import { getSeller } from "@/data/sellers";
import { AUCTION_POLICY, DEMO_USER } from "@/data/site";
import { detailPath, discountPercent } from "@/lib/catalog";
import { moneyText } from "@/lib/format";
import { COPY } from "./copy";
import { useFloor, useFloorLot } from "./state";
import { GradeTag, Thumb, TimeText, btnClass, cx } from "./ui";

export function WatchToggle({ product, className = "", withLabel = false }) {
  const { t, ui } = useLang();
  const { isWatched, toggleWatch, toast } = useStore();
  const on = isWatched(product.slug);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={withLabel ? undefined : `${on ? ui("removeFromWatchlist") : ui("addToWatchlist")}: ${t(product.title)}`}
      onClick={() => {
        const now = toggleWatch(product.slug);
        toast({ tone: now ? "success" : "neutral", title: now ? ui("addedToWatchlist") : ui("removedFromWatchlist"), description: t(product.title) });
      }}
      className={cx(
        withLabel
          ? btnClass("outline", "md")
          : "inline-grid size-10 shrink-0 place-items-center rounded-control border border-line-strong bg-surface text-fg transition-colors hover:border-fg",
        className,
      )}
    >
      <Heart aria-hidden="true" className={cx("size-4", on ? "fill-accent text-accent" : "")} />
      {withLabel ? (on ? t(COPY.watching2) : t(COPY.watch)) : null}
    </button>
  );
}

function PhotoRow({ product }) {
  const { t } = useLang();
  const { link } = useConcept();
  const seller = getSeller(product.seller);
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Thumb image={product.images[0]} size={60} />
      <div className="min-w-0 flex-1">
        <Link href={link(detailPath(product))} className="line-clamp-2 ac-sm font-semibold text-fg hover:underline">
          {t(product.title)}
        </Link>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 ac-xs text-fg-3">
          <GradeTag grade={product.grade} long />
          {seller ? <span className="truncate">· {t(seller.name)}</span> : null}
        </p>
      </div>
    </div>
  );
}

/** Bid ticket — data first: status, plain-language time, current bid; then the lot; then Bid. */
export function BidTicket({ product, className = "" }) {
  const { t, pl } = useLang();
  const { askBid } = useFloor();
  const { currentBid, bidCount, minNext, winning } = useFloorLot(product);
  return (
    <article className={cx("ac-ticket", className)}>
      <div className="px-4 pb-3 pt-3.5">
        <p className="flex items-center justify-between gap-2 ac-xs font-semibold">
          {winning ? (
            <span className="inline-flex items-center gap-1 text-fg">
              <Check aria-hidden="true" className="size-3.5" />
              {t(COPY.youreWinning)}
            </span>
          ) : (
            <span className="ac-label text-fg-3">{t(COPY.openForBids)}</span>
          )}
          <span className="ac-num text-fg-3">{pl("bids", bidCount)}</span>
        </p>
        <p className="mt-1.5 ac-time text-fg">
          <TimeText target={product.endsIn} template={COPY.closesIn} />
        </p>
        <p className="mt-2 flex items-baseline gap-2">
          <span className="ac-label text-fg-3">{t(COPY.current)}</span>
          <Money value={currentBid} className="ac-figure text-fg" />
        </p>
      </div>
      <PhotoRow product={product} />
      <div className="mt-auto flex items-center gap-2 p-3">
        <button type="button" onClick={() => askBid(product.slug, minNext)} className={btnClass("ink", "md", "flex-1")}>
          <Gavel aria-hidden="true" className="size-4" />
          {t(COPY.bidN, { amount: moneyText(minNext) })}
          <span className="sr-only">: {t(product.title)}</span>
        </button>
        <WatchToggle product={product} />
      </div>
    </article>
  );
}

/** Stock ticket (Buy Now) — the same grammar: stock, price and saving; the lot; Add to cart. */
export function StockTicket({ product, className = "" }) {
  const { t } = useLang();
  const { addToCart, toast } = useStore();
  const pct = discountPercent(product);
  const soldOut = product.stock <= 0;
  return (
    <article className={cx("ac-ticket", className)}>
      <div className="px-4 pb-3 pt-3.5">
        <p className="ac-label text-fg-3">{soldOut ? t(COPY.soldOut) : t(COPY.inStock, { n: product.stock })}</p>
        <p className="mt-1.5">
          <Money value={product.price} className="ac-time text-fg" />
        </p>
        {pct > 0 ? (
          <p className="mt-1 ac-xs text-fg-3">
            {t(COPY.wasSave, { was: moneyText(product.originalPrice), pct })}
          </p>
        ) : null}
      </div>
      <PhotoRow product={product} />
      <div className="mt-auto flex items-center gap-2 p-3">
        <button
          type="button"
          disabled={soldOut}
          onClick={() => {
            addToCart(product.slug, 1);
            toast({ tone: "success", title: t(COPY.addedToCart), description: t(product.title) });
          }}
          className={btnClass("outline", "md", "flex-1")}
        >
          <ShoppingCart aria-hidden="true" className="size-4" />
          {t(COPY.addToCart)}
          <span className="sr-only">: {t(product.title)}</span>
        </button>
        <WatchToggle product={product} />
      </div>
    </article>
  );
}

/** Every amount button opens this confirm step. */
export function BidConfirm() {
  const { t, ui } = useLang();
  const { confirm, cancelBid, placeBid } = useFloor();
  const product = confirm ? getProduct(confirm.slug) : null;
  return (
    <Modal
      open={Boolean(confirm && product)}
      onClose={cancelBid}
      title={t(COPY.confirmTitle)}
      variant="sheet"
      initialFocus="[data-autofocus]"
      panelClassName="rounded-t-[16px] bg-elevated p-5 font-sans text-fg shadow-overlay md:rounded-[16px] md:p-6"
    >
      {product ? (
        <div>
          <p className="ac-h3" aria-hidden="true">
            {t(COPY.confirmTitle)}
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-[10px] border border-line p-3">
            <Thumb image={product.images[0]} size={56} />
            <div className="min-w-0">
              <p className="ac-xs text-fg-3">{t(COPY.confirmLine, { amount: moneyText(confirm.amount) })}</p>
              <p className="line-clamp-2 ac-sm font-semibold">{t(product.title)}</p>
            </div>
          </div>
          <p className="mt-4 flex items-baseline justify-between gap-3 border-b border-line pb-3">
            <span className="ac-label text-fg-3">{ui("yourBid")}</span>
            <Money value={confirm.amount} className="ac-hero-figure text-fg" />
          </p>
          <p className="mt-3 ac-xs text-fg-2">{t(COPY.confirmDeposit, { amount: moneyText(AUCTION_POLICY.depositAmount), wallet: moneyText(DEMO_USER.walletBalance) })}</p>
          <p className="mt-1.5 ac-xs text-fg-3">{ui("bindingBid")}</p>
          <p className="mt-1.5 ac-xs text-fg-3">{ui("antiSnipe")}</p>
          <div className="mt-5 flex gap-2">
            <button type="button" data-autofocus onClick={() => placeBid(product.slug, confirm.amount)} className={btnClass("ink", "lg", "flex-1")}>
              {t(COPY.confirmBid)}
            </button>
            <button type="button" onClick={cancelBid} className={btnClass("outline", "lg")}>
              {t(COPY.cancel)}
            </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
