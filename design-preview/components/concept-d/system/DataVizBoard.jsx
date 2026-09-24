"use client";

import { Check } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { getProduct } from "@/data/products";
import { useLot } from "../market/MarketProvider";
import { CountdownRing } from "../ui/CountdownRing";
import { TimeBar } from "../ui/TimeBar";
import { StepChart } from "../ui/StepChart";
import { Sparkline } from "../ui/Sparkline";
import { StockMeter, HeatMeter } from "../ui/Meters";
import { ManifestBar } from "../ui/ManifestBar";
import { DeltaChip } from "../ui/Chips";
import { usePriceTooltip } from "../ui/PriceTooltip";
import { pricePoints } from "../lib/data";
import { useCopy } from "../lib/useCopy";
import { Specimen } from "./SystemSection";

const RINGS = [
  { tone: "ink", fraction: 0.72, text: "17:18:02", key: "ringNormal" },
  { tone: "warning", fraction: 0.032, text: "46:03", key: null, ui: "endingSoon" },
  { tone: "danger", fraction: 0.006, text: "09:12", key: null, ui: "closingNow" },
  { tone: "upcoming", fraction: 1, text: "1d 6h", key: null, ui: "upcoming" },
  { tone: "muted", fraction: 0, text: null, key: null, ui: "sold" },
];

/** Rings, bars, the step chart, meters and the manifest bar. */
export function DataVizBoard() {
  const { ui, money } = useLang();
  const c = useCopy();
  const tooltip = usePriceTooltip();
  const fridge = getProduct("fridge-690");
  const lot = useLot("fridge-690");
  const points = pricePoints(lot.history, lot.currentBid, fridge.startingBid);
  const pallet = getProduct("electronics-pallet");

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="d-panel space-y-7 p-5">
        <Specimen label={c("sysRings")}>
          {RINGS.map((ring) => (
            <div key={ring.tone} className="flex flex-col items-center gap-2">
              <CountdownRing fraction={ring.fraction} size={64} stroke={4} tone={ring.tone} head>
                {ring.text ? <span className="d-num text-[10.5px] font-medium text-fg">{ring.text}</span> : <Check aria-hidden="true" className="size-5 text-success" />}
              </CountdownRing>
              <span className="text-[11px] text-fg-3">{ring.key ? c(ring.key) : ui(ring.ui)}</span>
            </div>
          ))}
        </Specimen>
        <Specimen label={c("sysBars")}>
          <div className="w-full space-y-3">
            {["ink", "warning", "danger", "upcoming"].map((tone, i) => (
              <TimeBar key={tone} tone={tone} fraction={[0.72, 0.32, 0.08, 1][i]} />
            ))}
          </div>
        </Specimen>
        <Specimen label={c("sysHeat")}>
          {[1, 2, 3, 4].map((level) => (
            <HeatMeter key={level} level={level} />
          ))}
          <Sparkline values={points.map((p) => p.amount)} />
          <DeltaChip amount={50} />
        </Specimen>
      </div>
      <div className="d-panel space-y-7 p-5">
        <Specimen label={c("sysChart")}>
          <StepChart points={points} height={120} tooltip={tooltip} className="w-full" label={c("priceChartLabel", { from: money(points[0].amount), to: money(lot.currentBid), n: points.length })} />
        </Specimen>
        <Specimen label={c("sysStock")}>
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
            {[32, 6, 3, 0].map((stock) => (
              <StockMeter key={stock} stock={stock} segments={10} />
            ))}
          </div>
        </Specimen>
        <Specimen label={c("sysManifest")}>
          <ManifestBar lines={pallet.palletContents} label={ui("palletContents")} className="w-full" legendLimit={6} />
        </Specimen>
      </div>
    </div>
  );
}
