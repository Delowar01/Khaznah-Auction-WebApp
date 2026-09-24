"use client";

import { BadgeCheck, ClipboardCheck, Clock, MapPin, Truck } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { sellerStats } from "@/lib/catalog";
import { TRUST_POINTS } from "@/data/site";
import { Eyebrow } from "../ui/Type";
import { COPY } from "../copy";

/** Numbers, the seller's own description, pickup details and trust indicators. */
export function StoreFacts({ seller }) {
  const { t, ui } = useLang();
  const stats = sellerStats(seller.code);
  const graded = TRUST_POINTS.find((p) => p.key === "graded");
  const delivery = TRUST_POINTS.find((p) => p.key === "delivery");
  const numbers = [
    { label: ui("activeAuctions"), value: stats.activeAuctions },
    { label: ui("buyNowItems"), value: stats.buyNowCount },
    { label: t(COPY.categoriesStat), value: stats.categories.length },
  ];
  const trust = [
    { icon: BadgeCheck, title: ui("verifiedSeller"), text: t(COPY.verifiedText) },
    { icon: ClipboardCheck, title: t(graded.title), text: t(graded.text) },
    { icon: Truck, title: t(delivery.title), text: t(delivery.text) },
  ];

  return (
    <section className="mx-auto max-w-[1360px] px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
      <dl className="grid grid-cols-3 divide-x divide-line border-y border-line rtl:divide-x-reverse">
        {numbers.map((n) => (
          <div key={n.label} className="flex flex-col-reverse px-3 py-6 text-center sm:px-6 sm:py-8">
            <dt className="mt-3 text-[12px] text-fg-2 sm:text-[13px] rtl:text-[13px]">{n.label}</dt>
            <dd className="a-display text-[40px] leading-none text-fg sm:text-[64px] tabular">{n.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="min-w-0 lg:col-span-7">
          <Eyebrow>{ui("aboutSeller")}</Eyebrow>
          <p className="a-serif mt-4 text-[26px] leading-[1.35] text-fg sm:text-[30px] rtl:text-[26px] rtl:leading-[1.7]">{t(seller.tagline)}</p>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-fg-2 rtl:text-base rtl:leading-8">{t(seller.description)}</p>
        </div>
        <div className="min-w-0 space-y-6 lg:col-span-5">
          <div className="rounded-card border border-line bg-surface p-6">
            <Eyebrow>{ui("pickupHours")}</Eyebrow>
            <p className="mt-4 flex items-start gap-3 text-[15px] leading-relaxed text-fg rtl:leading-7">
              <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-fg-3" />
              {t(seller.pickup).split(" · ")[0]}
            </p>
            {t(seller.pickup).includes(" · ") ? (
              <p className="mt-2 flex items-start gap-3 text-[15px] text-fg-2">
                <Clock aria-hidden="true" className="mt-1 size-4 shrink-0 text-fg-3" />
                <span dir="auto">{t(seller.pickup).split(" · ")[1]}</span>
              </p>
            ) : null}
          </div>
          <ul className="space-y-5">
            {trust.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-auction" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-semibold text-fg">{title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-fg-2 rtl:text-sm rtl:leading-6">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
