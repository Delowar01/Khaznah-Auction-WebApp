"use client";

import { BadgeCheck, CircleHelp } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { getGrade, SOURCE_TYPES } from "@/data/grades";
import { getSeller } from "@/data/sellers";
import { Button } from "../ui/Button";
import { GradeChip } from "../ui/GradeChip";
import { Tabs } from "../ui/Tabs";
import { COPY } from "../copy";
import { Fulfilment } from "./Fulfilment";
import { ManifestTable } from "./ManifestTable";
import { SpecsTable } from "./SpecsTable";

function Overview({ product }) {
  const { t } = useLang();
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <p className="max-w-3xl kb-lg text-fg-2 text-pretty">{t(product.description)}</p>
      <SpecsTable specs={product.specs.slice(0, 3)} />
    </div>
  );
}

function ConditionPanel({ product, onGradeGuide }) {
  const { t, ui } = useLang();
  const grade = getGrade(product.grade);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex items-start gap-4 rounded-xl border border-line bg-surface p-4">
        <GradeChip grade={product.grade} size="lg" letter />
        <div>
          <p className="kb-md font-bold text-fg">{t(grade.label)}</p>
          <p className="mt-1 kb-sm text-fg-2">{t(grade.text)}</p>
          <Button variant="ghost" size="sm" icon={CircleHelp} onClick={onGradeGuide} className="-ms-3 mt-2 text-primary">
            {ui("whatGradeMeans")}
          </Button>
        </div>
      </div>
      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="kb-md font-bold text-fg">{ui("conditionReport")}</p>
        <p className="mt-1 kb-sm text-fg-2">{t(product.conditionNote)}</p>
        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 kb-sm">
          <div>
            <dt className="kb-2xs text-fg-3">{ui("source")}</dt>
            <dd className="font-semibold text-fg">{t(SOURCE_TYPES[product.source])}</dd>
          </div>
          <div>
            <dt className="kb-2xs text-fg-3">{ui("lotNumber")}</dt>
            <dd dir="ltr" className="font-semibold text-fg tabular">
              {product.lot}
            </dd>
          </div>
        </dl>
        <p className="mt-3 inline-flex items-center gap-1.5 kb-xs font-semibold text-success">
          <BadgeCheck aria-hidden="true" className="size-3.5" />
          {ui("inspected")}
        </p>
      </div>
    </div>
  );
}

/** Overview · (Manifest) · Specifications · Condition · Delivery & returns. */
export function ProductTabs({ product, onGradeGuide, className = "" }) {
  const { t, ui } = useLang();
  const seller = getSeller(product.seller);
  const tabs = [
    { id: "overview", label: ui("overview"), content: <Overview product={product} /> },
    ...(product.palletContents ? [{ id: "manifest", label: ui("manifest"), content: <ManifestTable product={product} /> }] : []),
    { id: "specs", label: ui("specifications"), content: <SpecsTable specs={product.specs} /> },
    { id: "condition", label: ui("condition"), content: <ConditionPanel product={product} onGradeGuide={onGradeGuide} /> },
    { id: "delivery", label: t(COPY.deliveryReturns), content: <Fulfilment seller={seller} detailed className="max-w-2xl" /> },
  ];
  return (
    <section aria-label={t(product.title)} className={className}>
      <Tabs tabs={tabs} label={t(product.title)} panelClassName="pt-5" />
    </section>
  );
}
