"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { getProduct } from "@/data/products";
import { AuctionCard } from "../cards/AuctionCard";
import { BuyNowCard } from "../cards/BuyNowCard";
import { LiveLotCard } from "../cards/LiveLotCard";
import { CardSkeleton } from "../cards/LotCard";
import { useCopy } from "../lib/useCopy";

function Cell({ label, children }) {
  return (
    <li className="flex flex-col gap-2.5">
      <p className="d-label text-fg-3">{label}</p>
      <div className="flex flex-1">{children}</div>
    </li>
  );
}

/** A listing card in every state the marketplace produces. */
export function CardBoard() {
  const { ui } = useLang();
  const c = useCopy();
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
      <Cell label={ui("buyNow")}>
        <BuyNowCard product={getProduct("task-lamp")} />
      </Cell>
      <Cell label={ui("auction")}>
        <AuctionCard product={getProduct("tv-43")} />
      </Cell>
      <Cell label={c("sampleCardLive")}>
        <LiveLotCard />
      </Cell>
      <Cell label={ui("endingSoon")}>
        <AuctionCard product={getProduct("split-ac")} />
      </Cell>
      <Cell label={ui("closingNow")}>
        <AuctionCard product={getProduct("seat-covers")} />
      </Cell>
      <Cell label={ui("justListed")}>
        <BuyNowCard product={getProduct("microwave")} />
      </Cell>
      <Cell label={ui("upcoming")}>
        <AuctionCard product={getProduct("leather-sofa")} />
      </Cell>
      <Cell label={ui("sold")}>
        <AuctionCard product={getProduct("robot-vacuum")} />
      </Cell>
      <Cell label={c("sampleCardEnded")}>
        <AuctionCard product={getProduct("washer-front")} override={{ phase: "ended", remaining: 0 }} />
      </Cell>
      <Cell label={ui("outOfStock")}>
        <BuyNowCard product={getProduct("tyre-inflator")} />
      </Cell>
      <Cell label={c("sampleCardWatched")}>
        <BuyNowCard product={getProduct("suede-tote")} />
      </Cell>
      <Cell label={ui("loading")}>
        <div className="w-full">
          <CardSkeleton />
        </div>
      </Cell>
    </ul>
  );
}
