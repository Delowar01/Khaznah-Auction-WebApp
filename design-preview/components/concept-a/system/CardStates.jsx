"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { getProduct } from "@/lib/catalog";
import { LIVE_EVENT } from "@/data/live";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { AuctionCard } from "../cards/AuctionCard";
import { ProductCard } from "../cards/ProductCard";
import { Caption } from "./Section";
import { COPY } from "../copy";

function LiveLotCard() {
  const { t, ui } = useLang();
  const lot = LIVE_EVENT.items.find((item) => item.status === "live");
  return (
    <article className="a-stage flex h-[calc(100%-1.75rem)] min-h-[360px] flex-col overflow-hidden rounded-card">
      <div className="relative flex-1">
        <Img image={LIVE_EVENT.stream} alt="" sizes="25vw" className="absolute inset-0 size-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/10" aria-hidden="true" />
        <span className="absolute start-3 top-3 inline-flex items-center gap-2 rounded-xs bg-[var(--live-solid)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white rtl:text-xs rtl:normal-case rtl:tracking-normal">
          <span className="kz-live-dot !size-1.5 !bg-white" aria-hidden="true" />
          {ui("live")}
        </span>
        <div className="absolute inset-x-4 bottom-4">
          <p className="text-[12px] text-[var(--stage-muted)]">{ui("lotOf", { n: lot.order, total: LIVE_EVENT.items.length })}</p>
          <p className="a-serif mt-1 text-[20px] leading-snug text-[var(--stage-fg)]">{t(lot.title)}</p>
          <p className="a-serif mt-2 text-[26px] leading-none text-[var(--stage-fg)]">
            <Money value={lot.currentBid} symbolClassName="text-[0.8em]" />
          </p>
        </div>
      </div>
    </article>
  );
}

const CARDS = [
  { label: (ui) => ui("liveNow"), slug: "tv-43" },
  { label: (ui) => ui("endingSoon"), slug: "split-ac" },
  { label: (ui) => ui("closingNow"), slug: "seat-covers" },
  { label: (ui) => ui("upcoming"), slug: "leather-sofa" },
  { label: (ui) => ui("sold"), slug: "robot-vacuum" },
  { label: (ui) => ui("newListing"), slug: "microwave" },
  { label: (ui, t) => t(COPY.lowStockLabel), slug: "capsule-coffee" },
  { label: (ui) => ui("soldOut"), slug: "tyre-inflator" },
  { label: (ui, t) => t(COPY.watchedLabel), slug: "field-watch", watched: true },
];

/** The catalogue card in each state a lot can be in. */
export function CardStates() {
  const { t, ui } = useLang();
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
      <div>
        <Caption>{t(COPY.liveLotLabel)}</Caption>
        <LiveLotCard />
      </div>
      {CARDS.map(({ label, slug, watched }) => {
        const product = getProduct(slug);
        const Card = product.saleType === "buy_now" ? ProductCard : AuctionCard;
        return (
          <div key={slug}>
            <Caption>{label(ui, t)}</Caption>
            <Card product={product} forceWatched={watched} />
          </div>
        );
      })}
    </div>
  );
}
