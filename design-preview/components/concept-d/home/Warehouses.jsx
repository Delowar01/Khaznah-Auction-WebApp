"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Reveal } from "@/components/shared/ui/Reveal";
import { SELLERS, CITIES } from "@/data/sellers";
import { sellerStats } from "@/lib/catalog";
import { formatMonthYear } from "@/lib/format";
import { Container, SectionHeader } from "../ui/Layout";
import { SellerAvatar } from "../ui/SellerAvatar";
import { StatusChip } from "../ui/Chips";
import { useCopy } from "../lib/useCopy";

const TH = "d-label px-4 pb-3 pt-4 font-medium text-fg-3";

function WarehouseRow({ seller }) {
  const { link } = useConcept();
  const { t, ui, lang } = useLang();
  const stats = sellerStats(seller.code);
  const href = link(`/seller/${seller.code}`);
  return (
    <tr className="border-t border-line transition-colors hover:bg-[var(--d-row-hover)]">
      <td className="px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <SellerAvatar seller={seller} size="md" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <Link href={href} className="flex items-center gap-1.5 text-sm font-medium text-fg hover:underline">
                <span className="truncate">{t(seller.name)}</span>
              </Link>
              {seller.liveNow ? <StatusChip status="live" label={ui("sellerLive")} /> : null}
            </div>
            <p className="mt-0.5 hidden max-w-[16rem] truncate text-xs text-fg-3 lg:block xl:max-w-[22rem]">{t(seller.tagline)}</p>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-fg-2">{t(CITIES[seller.city])}</td>
      <td className="d-num px-4 py-3.5 text-end text-sm text-fg">{stats.activeAuctions}</td>
      <td className="d-num px-4 py-3.5 text-end text-sm text-fg">{stats.buyNowCount}</td>
      <td className="d-num hidden whitespace-nowrap px-4 py-3.5 text-sm text-fg-2 lg:table-cell">{formatMonthYear(seller.memberSince, lang)}</td>
      <td className="px-4 py-3.5 text-end">
        <Link href={href} className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-control px-3 text-[13px] font-medium text-fg-2 ring-1 ring-inset ring-line-strong transition-colors hover:bg-surface-2 hover:text-fg">
          {ui("visitStore")}
          <DirIcon icon={ArrowRight} className="size-3.5" />
        </Link>
      </td>
    </tr>
  );
}

function WarehouseCard({ seller }) {
  const { link } = useConcept();
  const { t, ui } = useLang();
  const c = useCopy();
  const stats = sellerStats(seller.code);
  return (
    <li className="d-panel relative flex items-center gap-3 p-3.5">
      <SellerAvatar seller={seller} size="md" />
      <div className="min-w-0 flex-1">
        <Link href={link(`/seller/${seller.code}`)} className="flex items-center gap-1.5 text-sm font-medium text-fg after:absolute after:inset-0 after:rounded-card">
          <span className="truncate">{t(seller.name)}</span>
        </Link>
        <p className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-fg-3">
          <span>{t(CITIES[seller.city])}</span>
          <span>
            {ui("auctions")} <span className="d-num text-fg-2">{stats.activeAuctions}</span>
          </span>
          <span>
            {ui("buyNow")} <span className="d-num text-fg-2">{stats.buyNowCount}</span>
          </span>
        </p>
      </div>
      {seller.liveNow ? <StatusChip status="live" label={c("watchLive")} /> : null}
    </li>
  );
}

/** Verified warehouses as a data table (real fields only — no rankings). */
export function Warehouses() {
  const { ui } = useLang();
  const c = useCopy();
  return (
    <section aria-labelledby="warehouses-title" className="border-t border-line py-14 md:py-20">
      <Container>
        <SectionHeader id="warehouses-title" eyebrow={ui("sellers")} title={ui("sellerWarehouses")} text={c("warehousesText")} />
        <Reveal>
          <div className="d-panel relative hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] border-collapse text-start">
              <caption className="sr-only">{ui("sellerWarehouses")}</caption>
              <thead>
                <tr>
                  <th scope="col" className={`${TH} text-start`}>{c("colWarehouse")}</th>
                  <th scope="col" className={`${TH} text-start`}>{c("colCity")}</th>
                  <th scope="col" className={`${TH} text-end`}>{ui("activeAuctions")}</th>
                  <th scope="col" className={`${TH} text-end`}>{ui("buyNowItems")}</th>
                  <th scope="col" className={`${TH} hidden text-start lg:table-cell`}>{c("colSince")}</th>
                  <th scope="col" className={TH}>
                    <span className="sr-only">{ui("visitStore")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {SELLERS.map((seller) => (
                  <WarehouseRow key={seller.code} seller={seller} />
                ))}
              </tbody>
            </table>
          </div>
          <ul className="space-y-2 md:hidden">
            {SELLERS.map((seller) => (
              <WarehouseCard key={seller.code} seller={seller} />
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
