"use client";

import { useId, useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Tabs, TabPanel } from "../ui/Tabs";
import { Overview, SpecsGrid } from "./SpecsGrid";
import { ConditionReport } from "./ConditionReport";
import { ManifestPanel } from "../auction/ManifestPanel";

/** Overview · Specifications · Condition (· Manifest for pallets). */
export function ProductTabs({ product }) {
  const { ui } = useLang();
  const baseId = `product-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const tabs = [
    { key: "overview", label: ui("overview") },
    { key: "specs", label: ui("specifications") },
    { key: "condition", label: ui("condition") },
    ...(product.palletContents ? [{ key: "manifest", label: ui("manifest"), count: product.palletContents.length }] : []),
  ];
  const [tab, setTab] = useState(product.palletContents ? "manifest" : "overview");

  return (
    <section aria-label={ui("description")} className="mt-8">
      <Tabs baseId={baseId} tabs={tabs} value={tab} onChange={setTab} label={ui("description")} />
      <div className="pt-6">
        <TabPanel baseId={baseId} tabKey="overview" active={tab === "overview"}>
          <Overview product={product} />
        </TabPanel>
        <TabPanel baseId={baseId} tabKey="specs" active={tab === "specs"}>
          <SpecsGrid product={product} />
        </TabPanel>
        <TabPanel baseId={baseId} tabKey="condition" active={tab === "condition"}>
          <ConditionReport product={product} />
        </TabPanel>
        {product.palletContents ? (
          <TabPanel baseId={baseId} tabKey="manifest" active={tab === "manifest"}>
            <ManifestPanel product={product} />
          </TabPanel>
        ) : null}
      </div>
    </section>
  );
}
