"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { getProduct } from "@/data/products";
import { LiveLotCard } from "../cards/LiveLotCard";
import { LotCard } from "../cards/LotCard";
import { LotRow } from "../cards/LotRow";
import { MiniCard } from "../cards/MiniCard";
import { COPY } from "../copy";
import { Specimen } from "./SystemSection";

const CASES = [
  { copy: COPY.cardNormal, slug: "task-lamp" },
  { copy: COPY.cardAuction, slug: "tv-43" },
  { copy: COPY.cardLive, live: true },
  { copy: COPY.cardEnding, slug: "split-ac" },
  { copy: COPY.cardCritical, slug: "seat-covers" },
  { copy: COPY.cardNew, slug: "microwave" },
  { copy: COPY.cardSold, slug: "robot-vacuum" },
  { copy: COPY.cardUnavailable, slug: "tyre-inflator" },
  { copy: COPY.cardWatched, slug: "suede-tote" },
  { copy: COPY.cardUpcoming, slug: "leather-sofa" },
];

/** The card system in every state, plus the list row and compact card. */
export function CardStates() {
  const { t } = useLang();
  return (
    <div className="grid gap-6">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {CASES.map((item) => (
          <li key={item.slug || "live"}>
            <Specimen label={t(item.copy)} className="h-full">
              <div className="flex-1">{item.live ? <LiveLotCard /> : <LotCard product={getProduct(item.slug)} />}</div>
            </Specimen>
          </li>
        ))}
      </ul>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Specimen label={t(COPY.cardListRow)}>
          <LotRow product={getProduct("kitchen-pallet")} />
        </Specimen>
        <Specimen label={t(COPY.cardCompact)}>
          <MiniCard product={getProduct("laptop-bags-24")} />
        </Specimen>
      </div>
    </div>
  );
}
