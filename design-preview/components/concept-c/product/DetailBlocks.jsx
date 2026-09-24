"use client";

import Link from "next/link";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { CITIES, getSeller } from "@/data/sellers";
import { ITEM_TYPES, SOURCE_TYPES } from "@/data/grades";
import { formatMonthYear } from "@/lib/format";
import { UI } from "@/data/ui";
import { COPY } from "../copy";
import { EyebrowRule } from "../ui/Section";
import { ButtonLink } from "../ui/Button";
import { Diamond } from "../ui/Diamond";
import { DiamondList } from "../ui/Misc";
import { DiamondAvatar } from "../seller/DiamondAvatar";

/** Architectural definition table: two columns, hairlines, labels in the secondary colour. */
export function SpecTable({ product }) {
  const { t, ui } = useLang();
  const rows = [
    ...product.specs.map((s) => [t(s.k), t(s.v)]),
    [ui("source"), t(SOURCE_TYPES[product.source])],
    [ui("itemType"), t(ITEM_TYPES[product.itemType])],
  ];
  return (
    <section aria-labelledby="specs-title">
      <EyebrowRule content={UI.specifications} className="mb-2" />
      <h2 id="specs-title" className="sr-only">
        {ui("specifications")}
      </h2>
      <dl className="grid sm:grid-cols-2 sm:gap-x-10">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-4 border-b border-line py-3.5">
            <dt className="text-[0.9375rem] text-fg-2">{k}</dt>
            <dd className="text-[0.9375rem] font-medium text-fg">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Description with diamond-bulleted highlights. */
export function Description({ product }) {
  const { t, ui } = useLang();
  return (
    <section aria-labelledby="desc-title">
      <EyebrowRule content={UI.description} className="mb-5" />
      <h2 id="desc-title" className="sr-only">
        {ui("description")}
      </h2>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <p className="c-prose">{t(product.description)}</p>
        <div>
          <p className="c-caps mb-3 text-fg-3">{t(COPY.highlights)}</p>
          <DiamondList items={product.highlights.map((h) => t(h))} className="text-[0.9375rem] font-medium text-fg" />
        </div>
      </div>
    </section>
  );
}

/** Delivery, pickup and returns rows with diamond bullets. */
export function InfoRows({ product }) {
  const { t, ui } = useLang();
  const seller = getSeller(product.seller);
  const rows = [
    [ui("delivery"), ui("deliveryText")],
    [ui("pickup"), ui("pickupText", { city: t(CITIES[seller?.city]) })],
    [ui("returns"), ui("returnsText")],
  ];
  return (
    <ul className="divide-y divide-line border-y border-line">
      {rows.map(([title, text]) => (
        <li key={title} className="flex gap-3 py-3.5">
          <Diamond size={6} className="mt-[0.55em] text-accent" />
          <div>
            <p className="text-sm font-semibold text-fg">{title}</p>
            <p className="text-sm text-fg-2">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Compact seller card linking to the storefront. */
export function SellerMiniCard({ code }) {
  const { t, ui, lang } = useLang();
  const { link } = useConcept();
  const seller = getSeller(code);
  if (!seller) return null;
  return (
    <div className="flex items-center gap-4 rounded-md border border-line bg-surface p-4">
      <DiamondAvatar seller={seller} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-fg-3">{ui("soldBy")}</p>
        <p className="flex items-center gap-1.5 font-semibold text-fg">
          <Link href={link(`/seller/${seller.code}`)} className="c-link truncate">
            {t(seller.name)}
          </Link>
        </p>
        <p className="text-xs text-fg-2">
          {t(CITIES[seller.city])} · {ui("memberSince", { date: formatMonthYear(seller.memberSince, lang) })}
        </p>
      </div>
      <ButtonLink href={link(`/seller/${seller.code}`)} variant="outline" size="sm" className="hidden sm:inline-flex">
        {ui("visitStore")}
      </ButtonLink>
    </div>
  );
}
