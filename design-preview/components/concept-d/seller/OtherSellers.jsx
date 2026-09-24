"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { CITIES, SELLERS } from "@/data/sellers";
import { SellerAvatar, VerifiedMark } from "../ui/SellerAvatar";
import { StatusChip } from "../ui/Chips";
import { useCopy } from "../lib/useCopy";

/** Links to the other verified storefronts. */
export function OtherSellers({ current }) {
  const { link } = useConcept();
  const { t, ui } = useLang();
  const c = useCopy();
  const others = SELLERS.filter((s) => s.code !== current);
  return (
    <section aria-labelledby="other-sellers" className="border-t border-line py-10 md:py-14">
      <h2 id="other-sellers" className="d-tight text-xl font-semibold text-fg">
        {c("otherWarehouses")}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {others.map((seller) => (
          <li key={seller.code}>
            <Link href={link(`/seller/${seller.code}`)} className="d-card d-panel group flex items-center gap-3 p-3.5">
              <SellerAvatar seller={seller} size="md" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-sm font-medium text-fg">
                  <span className="truncate">{t(seller.name)}</span>
                  <VerifiedMark />
                </span>
                <span className="mt-0.5 block text-xs text-fg-3">{t(CITIES[seller.city])}</span>
              </span>
              {seller.liveNow ? <StatusChip status="live" label={ui("live")} /> : <DirIcon icon={ArrowRight} className="size-4 text-fg-3 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
