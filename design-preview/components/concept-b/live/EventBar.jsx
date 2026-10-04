"use client";

import Link from "next/link";
import { CheckCheck, Eye, ListOrdered, Wifi } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { LiveBadge } from "../ui/Badge";
import { cx } from "../ui/cx";

function Readout({ icon: Icon, children, className = "" }) {
  return (
    <li className={cx("inline-flex h-8 items-center gap-1.5 rounded-lg bg-white/[0.08] px-2.5 kb-xs font-semibold text-white ring-1 ring-inset ring-white/10", className)}>
      <Icon aria-hidden="true" className="size-3.5 shrink-0 text-white/70" strokeWidth={2.25} />
      {children}
    </li>
  );
}

/**
 * The control-room head: LIVE, the event title (the page's H1), presenter
 * and host, then read-outs — audience, the lot on the block, sale progress
 * and the connection.
 */
export function EventBar({ room, className = "" }) {
  const { ui } = useLang();
  const { link } = useConcept();
  const { event, lotInfo } = room;
  return (
    <section aria-labelledby="kb-live-title" className={cx("kb-on-dark overflow-hidden rounded-xl bg-[var(--kb-indigo-950)] text-white", className)}>
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg-short:py-4 xl:flex-row xl:items-end xl:justify-between xl:gap-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <LiveBadge size="md">{ui("liveNow")}</LiveBadge>
            <span className="kb-xs font-semibold text-white/75">{ui("liveAuction")}</span>
          </div>
          <h1 id="kb-live-title" className="mt-2 kb-h1 text-balance text-white">
            {event.title}
          </h1>
          <p className="mt-1.5 kb-sm text-white/80">
            {event.presenter} · {ui("hostedBy")}{" "}
            <Link href={link(event.hostHref)} className="rounded-sm font-semibold text-[var(--kb-gold-soft)] underline-offset-4 hover:underline">
              {event.hostName}
            </Link>
          </p>
        </div>
        <ul className="flex flex-wrap gap-2 xl:shrink-0 xl:justify-end">
          <Readout icon={Eye}>
            <span className="tabular">{event.viewers}</span>
          </Readout>
          {lotInfo ? <Readout icon={ListOrdered}>{lotInfo.of}</Readout> : null}
          <Readout icon={CheckCheck} className="max-sm:hidden">
            {event.progress}
          </Readout>
          <Readout icon={Wifi} className="max-sm:hidden">
            {ui("connected")}
          </Readout>
        </ul>
      </div>
    </section>
  );
}
