"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { CITIES, SELLERS } from "@/data/sellers";
import { sellerStats } from "@/lib/catalog";
import { COPY } from "../copy";
import { Echo } from "../ui/Bi";
import { Diamond } from "../ui/Diamond";
import { SectionHead } from "../ui/Section";
import { DiamondAvatar } from "./DiamondAvatar";

/** The other verified warehouses, as diamond-monogram cards. */
export function OtherSellers({ current }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const others = SELLERS.filter((s) => s.code !== current);
  return (
    <section aria-labelledby="sellers-title" className="py-14 lg:py-20">
      <div className="c-container">
        <SectionHead id="sellers-title" title={COPY.moreSellers} />
        <ul className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {others.map((seller) => {
            const stats = sellerStats(seller.code);
            return (
              <li key={seller.code}>
                <Link href={link(`/seller/${seller.code}`)} className="group flex h-full flex-col bg-bg p-6 transition-colors hover:bg-surface">
                  <div className="flex items-start justify-between">
                    <DiamondAvatar seller={seller} size="md" />
                    {seller.liveNow ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-live">
                        <Diamond variant="live" size={6} />
                        {ui("sellerLive")}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-fg group-hover:text-primary">{t(seller.name)}</h3>
                  <Echo content={seller.name} className="mt-1" />
                  <p className="mt-3 text-sm text-fg-2">
                    {t(CITIES[seller.city])} · {pl("lots", stats.total)}
                  </p>
                  <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold text-primary">
                    {ui("visitStore")}
                    <DirIcon icon={ArrowRight} className="size-4" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
