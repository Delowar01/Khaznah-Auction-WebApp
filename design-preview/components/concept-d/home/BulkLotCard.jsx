"use client";

import { Lock } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { isAuction } from "@/data/products";
import { detailPath } from "@/lib/catalog";
import { LotImage } from "../ui/LotImage";
import { StatusChip, LotTag } from "../ui/Chips";
import { GradeChip } from "../ui/GradeChip";
import { ManifestBar, UnitStrip } from "../ui/ManifestBar";
import { TimeBar } from "../ui/TimeBar";
import { compactTime } from "../lib/data";
import { useCopy } from "../lib/useCopy";
import { CardShell, CardTitle } from "../cards/CardShell";
import { auctionChip, useAuctionView } from "../cards/useLotView";

const TONE_TEXT = { ink: "text-fg-2", warning: "text-warning", danger: "text-live", upcoming: "d-ink", muted: "text-fg-3" };

/** Units in one carton/case: the lot quantity, or the "Per case" spec. */
function unitsPerPack(product) {
  if (product.quantity) return product.quantity;
  const perCase = product.specs?.find((spec) => spec.k.en === "Per case");
  return perCase ? parseInt(perCase.v.en, 10) || 1 : 1;
}

function PriceBlock({ product }) {
  const { ui, lang, money } = useLang();
  const c = useCopy();
  const v = useAuctionView(product);
  const auction = isAuction(product);
  const price = auction ? v.currentBid : product.price;
  const units = product.quantity || 1;
  return (
    <div className="flex w-full items-end justify-between gap-4 border-t border-line pt-4">
      <div className="min-w-0">
        <p className="d-label text-fg-3">{auction ? ui("currentBid") : ui("price")}</p>
        <span key={v.flash} className={`d-num mt-1 inline-block rounded px-0.5 text-xl font-medium text-fg ${auction && v.flash ? "d-flash" : ""}`}>
          <Money value={price} />
        </span>
        {units > 1 ? <p className="d-num mt-0.5 text-xs text-fg-3">{c("perUnit", { amount: money(Math.round(price / units)) })}</p> : null}
      </div>
      {auction ? (
        <div className="w-32 shrink-0 text-end">
          <p className={`d-num text-sm font-medium ${TONE_TEXT[v.tone]}`}>{compactTime(v.remaining, lang)}</p>
          <TimeBar fraction={v.fraction} tone={v.tone} className="mt-1.5" />
        </div>
      ) : product.fullStockRequired ? (
        <p className="flex items-center gap-1.5 text-xs text-fg-2">
          <Lock aria-hidden="true" className="size-3.5" />
          {c("fullLot")}
        </p>
      ) : null}
    </div>
  );
}

/** Pallet or carton lot: manifest bar (pallets) or unit strip (cartons/cases). */
export function BulkLotCard({ product }) {
  const { link } = useConcept();
  const { t, ui, pl } = useLang();
  const c = useCopy();
  const v = useAuctionView(product);
  const auction = isAuction(product);
  const lines = product.palletContents;
  const pack = unitsPerPack(product);

  return (
    <CardShell className="p-4 sm:p-5">
      <div className="flex gap-4">
        <LotImage image={product.images[0]} alt={t(product.title)} sizes="112px" className="size-24 shrink-0 rounded-xl ring-1 ring-line sm:size-28" inset="p-2" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusChip status={auction ? auctionChip(v.phase) : "buyNow"} />
            <GradeChip grade={product.grade} size="sm" />
            <LotTag lot={product.lot} />
          </div>
          <CardTitle href={link(detailPath(product))} className="mt-2.5">
            {t(product.title)}
          </CardTitle>
          <p className="d-num mt-1.5 text-xs text-fg-3">
            {lines ? `${pl("units", product.quantity)} · ${c("manifestLines", { n: lines.length })}` : product.unitLabel ? `${c("caseOf", { n: pack })} · ${ui("available", { n: product.stock })}` : c("cartonOf", { n: pack })}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {lines ? (
          <ManifestBar lines={lines} label={ui("palletContents")} legendLimit={4} />
        ) : (
          <div>
            <p className="d-label mb-2 text-fg-3">{ui("units")}</p>
            <UnitStrip units={pack} />
          </div>
        )}
      </div>
      <div aria-hidden="true" className="min-h-5 flex-1" />
      <PriceBlock product={product} />
    </CardShell>
  );
}
