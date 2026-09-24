"use client";

import Link from "next/link";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { getSeller } from "@/data/sellers";
import { formatNumber } from "@/lib/format";
import { COPY } from "../copy";
import { BiHeading } from "../ui/Bi";
import { Diamond } from "../ui/Diamond";
import { Breadcrumbs } from "../ui/Misc";
import { cx } from "../ui/cx";

function Fact({ label, className = "", children }) {
  return (
    <div className={cx("bg-bg px-4 py-3 sm:px-5", className)}>
      <dt className="text-xs text-fg-3">{label}</dt>
      <dd className="mt-0.5 font-semibold text-fg">{children}</dd>
    </div>
  );
}

/** Live room head on the hairline grid: title, the sale's name and live facts. */
export function LiveHead({ live }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { event, viewers, currentIndex, items } = live;
  const host = getSeller(event.host);

  return (
    <section className="relative overflow-hidden border-b border-line">
      <span className="c-gridlines" style={{ "--grid": "4rem", "--grid-mask": "linear-gradient(to bottom, black, transparent 95%)" }} />
      <div className="c-container relative pb-8 pt-6 lg:pb-10 lg:pt-8">
        <Breadcrumbs items={[{ label: ui("home"), href: link("/") }, { label: ui("liveAuctions") }]} />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="max-w-2xl">
            <p className="c-eyebrow text-live">
              <Diamond variant="live" size={8} />
              {ui("liveNow")}
            </p>
            <BiHeading as="h1" size="display" content={COPY.liveRoom} className="mt-4" titleClassName="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.25rem]" />
            <p className="mt-3 text-lg font-semibold text-fg-2">{t(event.title)}</p>
          </div>
          <dl className="grid w-full grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:w-auto sm:grid-cols-3">
            <Fact label={ui("viewers")}>
              <span className="c-num">{formatNumber(viewers)}</span>
            </Fact>
            <Fact label={ui("currentLot")}>
              <span className="c-num">
                {currentIndex + 1}/{items.length}
              </span>
            </Fact>
            <Fact label={ui("hostedBy")} className="col-span-2 sm:col-span-1">
              <Link href={link(`/seller/${host.code}`)} className="c-link">
                {t(host.name)}
              </Link>
            </Fact>
          </dl>
        </div>
      </div>
    </section>
  );
}
