"use client";

import Link from "next/link";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useMarket } from "../market/MarketProvider";
import { useCopy } from "../lib/useCopy";

/** Right side of the tab row: market readout + how-it-works link. */
export function MarketStatus() {
  const market = useMarket();
  const { link } = useConcept();
  const { ui } = useLang();
  const c = useCopy();
  const running = Object.values(market).filter((a) => a.phase === "live" || a.phase === "urgent" || a.phase === "critical").length;

  return (
    <div className="flex items-center gap-4 text-[12.5px]">
      <p className="flex items-center gap-2 text-fg-2">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
        <span>{c("marketOpen")}</span>
        <span aria-hidden="true" className="text-fg-3">
          ·
        </span>
        <span className="d-num text-fg-2">{c("auctionsLive", { n: running })}</span>
      </p>
      <Link href={`${link("/")}#how-it-works`} className="rounded-md px-2 py-1 font-medium text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg">
        {ui("howItWorks")}
      </Link>
    </div>
  );
}
