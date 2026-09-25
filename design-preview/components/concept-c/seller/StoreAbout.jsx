"use client";

import { Clock, Info, MapPin } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Reveal } from "@/components/shared/ui/Reveal";
import { TRUST_POINTS } from "@/data/site";
import { TRUST_ICONS } from "../home/TrustStrip";
import { Fulfilment } from "../product/Fulfilment";

/** About the seller, pickup & hours, and Khazna's trust indicators. */
export function StoreAbout({ seller }) {
  const { t, ui } = useLang();
  return (
    <Reveal as="section" aria-labelledby="kb-about" className="kb-container mt-14 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <h2 id="kb-about" className="flex items-center gap-2 kb-h2 text-fg">
          <Info aria-hidden="true" className="size-5 text-primary" />
          {ui("aboutSeller")}
        </h2>
        <p className="mt-3 max-w-2xl kb-lg text-fg-2 text-pretty">{t(seller.description)}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {TRUST_POINTS.map((point) => {
            const Icon = TRUST_ICONS[point.key];
            return (
              <li key={point.key} className="flex items-start gap-3 rounded-lg bg-surface-2/70 p-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-[18px]" />
                </span>
                <div>
                  <p className="kb-sm font-bold text-fg">{t(point.title)}</p>
                  <p className="kb-xs text-fg-2">{t(point.text)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="grid content-start gap-4">
        <div className="rounded-xl border border-line bg-surface p-5">
          <h3 className="flex items-center gap-2 kb-md font-bold text-fg">
            <Clock aria-hidden="true" className="size-4 text-primary" />
            {ui("pickupHours")}
          </h3>
          <p className="mt-2 flex items-start gap-2 kb-md text-fg-2">
            <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-fg-3" />
            {t(seller.pickup)}
          </p>
        </div>
        <Fulfilment seller={seller} />
      </div>
    </Reveal>
  );
}
