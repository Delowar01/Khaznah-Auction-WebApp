"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { getProduct } from "@/lib/catalog";
import { COPY } from "../copy";
import { LotCard } from "../cards/LotCard";
import { LiveLotCard } from "../cards/LiveLotCard";
import { StateLabel } from "./SystemSection";

const STATES = [
  { key: "stNormal", slug: "task-lamp" },
  { key: "stAuction", slug: "tv-43" },
  { key: "stLive", live: true },
  { key: "stEnding", slug: "split-ac" },
  { key: "stNew", slug: "microwave" },
  { key: "stSold", slug: "robot-vacuum" },
  { key: "stUnavailable", slug: "tyre-inflator" },
  { key: "stWatched", slug: "suede-tote" },
];

/** Lot cards in every state, using real lots from the catalogue. */
export function CardBoard() {
  const { t } = useLang();
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
      {STATES.map((state) => (
        <li key={state.key} className="flex flex-col">
          <StateLabel>{t(COPY[state.key])}</StateLabel>
          {state.live ? <LiveLotCard className="flex-1" /> : <LotCard product={getProduct(state.slug)} className="flex-1" />}
        </li>
      ))}
    </ul>
  );
}
