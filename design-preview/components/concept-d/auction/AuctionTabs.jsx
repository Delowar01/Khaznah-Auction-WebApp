"use client";

import { useId, useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { AUCTION_POLICY } from "@/data/site";
import { Tabs, TabPanel } from "../ui/Tabs";
import { Overview, SpecsGrid } from "../product/SpecsGrid";
import { ConditionReport } from "../product/ConditionReport";
import { SellerCard } from "../product/SellerCard";
import { useCopy } from "../lib/useCopy";
import { BidHistoryTable } from "./BidHistoryTable";
import { ManifestPanel } from "./ManifestPanel";

function AuctionTerms() {
  const { ui } = useLang();
  const c = useCopy();
  const rows = [
    { k: c("termDeposit"), v: <Money value={AUCTION_POLICY.depositAmount} className="d-num" /> },
    { k: c("termExtension"), v: c("termExtensionValue") },
    { k: c("termPayment"), v: c("termPaymentValue") },
    { k: c("termBinding"), v: c("termBindingValue") },
  ];
  return (
    <div>
      <h3 className="d-label mb-3 text-fg-3">{ui("auctionTerms")}</h3>
      <dl className="grid overflow-hidden rounded-xl border border-line sm:grid-cols-2">
        {rows.map((row, index) => (
          <div key={row.k} className={`flex justify-between gap-4 border-b border-line px-4 py-3 text-sm ${index % 2 === 0 ? "sm:border-e" : ""}`}>
            <dt className="text-fg-3">{row.k}</dt>
            <dd className="text-end font-medium text-fg">{row.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Bid history · Details · Manifest (pallets) · Seller. */
export function AuctionTabs({ product, auction }) {
  const { ui } = useLang();
  const c = useCopy();
  const baseId = `auction-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const tabs = [
    { key: "history", label: ui("bidHistory"), count: auction.bidCount },
    { key: "details", label: c("details") },
    ...(product.palletContents ? [{ key: "manifest", label: ui("manifest"), count: product.palletContents.length }] : []),
    { key: "seller", label: c("seller") },
  ];
  const [tab, setTab] = useState(product.palletContents ? "manifest" : "history");

  return (
    <section aria-label={ui("bidHistory")} className="mt-8">
      <Tabs baseId={baseId} tabs={tabs} value={tab} onChange={setTab} label={c("details")} />
      <div className="pt-6">
        <TabPanel baseId={baseId} tabKey="history" active={tab === "history"}>
          <BidHistoryTable history={auction.history} />
        </TabPanel>
        <TabPanel baseId={baseId} tabKey="details" active={tab === "details"} className="space-y-8">
          <Overview product={product} />
          <SpecsGrid product={product} />
          <ConditionReport product={product} />
          <AuctionTerms />
        </TabPanel>
        {product.palletContents ? (
          <TabPanel baseId={baseId} tabKey="manifest" active={tab === "manifest"}>
            <ManifestPanel product={product} />
          </TabPanel>
        ) : null}
        <TabPanel baseId={baseId} tabKey="seller" active={tab === "seller"}>
          <SellerCard code={product.seller} detailed className="max-w-xl" />
        </TabPanel>
      </div>
    </section>
  );
}
