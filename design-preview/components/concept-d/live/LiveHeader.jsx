"use client";

import Link from "next/link";
import { Eye, Mic } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { LIVE_EVENT } from "@/data/live";
import { getSeller } from "@/data/sellers";
import { useElapsed } from "@/lib/clock";
import { formatNumber } from "@/lib/format";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { SellerAvatar, VerifiedMark } from "../ui/SellerAvatar";
import { StatusChip } from "../ui/Chips";
import { useCopy } from "../lib/useCopy";

/** Event title, live status, viewers, presenter and host warehouse. */
export function LiveHeader({ live }) {
  const { link } = useConcept();
  const { t, ui } = useLang();
  const c = useCopy();
  const elapsed = useElapsed();
  const host = getSeller(LIVE_EVENT.host);
  const minutes = LIVE_EVENT.startedMinutesAgo + Math.floor(elapsed / 60);

  return (
    <div className="flex flex-col gap-4 py-5 lg:flex-row lg:items-end lg:justify-between lg:py-6">
      <div className="min-w-0">
        <Breadcrumbs items={[{ label: ui("home"), href: link("/") }, { label: ui("liveAuctions") }]} className="max-lg:hidden" />
        <div className="flex flex-wrap items-center gap-2 lg:mt-3">
          <StatusChip status="live" label={ui("liveNow")} />
          <span className="d-num inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs text-fg-2 ring-1 ring-inset ring-line">
            <Eye aria-hidden="true" className="size-3.5" />
            {formatNumber(live.viewers)}
            <span className="sr-only">{ui("viewers")}</span>
          </span>
          <span className="text-xs text-fg-3">{c("startedAgo", { n: minutes })}</span>
        </div>
        <h1 className="d-tight mt-2.5 text-2xl font-semibold text-fg text-balance sm:text-3xl">{t(LIVE_EVENT.title)}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-2 lg:gap-3">
        <div className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-2.5 py-1.5 lg:px-3 lg:py-2">
          <span className="grid size-8 place-items-center rounded-lg bg-surface-2 text-fg-2 ring-1 ring-inset ring-line lg:size-9">
            <Mic aria-hidden="true" className="size-4" />
          </span>
          <p className="text-sm font-medium text-fg">{t(LIVE_EVENT.presenter)}</p>
        </div>
        <Link href={link(`/seller/${host.code}`)} className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-2.5 py-1.5 transition-colors hover:border-line-strong lg:px-3 lg:py-2">
          <SellerAvatar seller={host} size="md" className="size-8 lg:size-9" />
          <div>
            <p className="hidden text-[11px] text-fg-3 lg:block">{c("host")}</p>
            <p className="flex items-center gap-1 text-sm font-medium text-fg">
              {t(host.name)}
              <VerifiedMark />
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
