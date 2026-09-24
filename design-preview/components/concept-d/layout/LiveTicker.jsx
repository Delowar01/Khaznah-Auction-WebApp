"use client";

import Link from "next/link";
import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { useReducedMotion } from "@/components/shared/ui/hooks";
import { getProduct } from "@/data/products";
import { useElapsed } from "@/lib/clock";
import { bidAge } from "@/lib/useAuction";
import { detailPath } from "@/lib/catalog";
import { useMarket } from "../market/MarketProvider";
import { Container } from "../ui/Layout";
import { useCopy } from "../lib/useCopy";

function shortAgo(seconds, lang) {
  const s = Math.max(0, Math.floor(seconds));
  const u = lang === "ar" ? { s: "ث", m: "د", h: "س" } : { s: "s", m: "m", h: "h" };
  if (s < 60) return `${s}${u.s}`;
  if (s < 3600) return `${Math.floor(s / 60)}${u.m}`;
  return `${Math.floor(s / 3600)}${u.h}`;
}

/** One entry per running lot: its latest bid, step and age (stable order). */
function useTickerRows() {
  const market = useMarket();
  const elapsed = useElapsed();
  return Object.entries(market)
    .filter(([, a]) => a.history.length && a.phase !== "upcoming" && a.phase !== "sold")
    .map(([slug, a]) => {
      const product = getProduct(slug);
      const [latest, previous] = a.history;
      return {
        slug,
        product,
        amount: a.currentBid,
        step: previous ? latest.amount - previous.amount : product.increment,
        age: bidAge(latest, elapsed),
        own: latest.isOwn,
        flash: a.flash,
        ended: a.phase === "ended",
      };
    });
}

function TickerItem({ row }) {
  const { link } = useConcept();
  const { lang, t } = useLang();
  return (
    <li className="shrink-0">
      <Link href={link(detailPath(row.product))} className="group flex h-8 items-center gap-2.5 rounded-md px-1.5 text-[12.5px] transition-colors hover:bg-surface-2">
        <span className="d-num text-fg-3" dir="ltr">
          {row.product.lot}
        </span>
        <span className="max-w-[13rem] truncate text-fg-2 group-hover:text-fg">{t(row.product.title)}</span>
        <span key={row.flash} className={`d-num rounded px-1 font-medium ${row.own ? "text-auction" : "text-fg"} ${row.flash ? "d-flash" : ""}`}>
          <Money value={row.amount} />
        </span>
        <span className="d-num text-success" dir="ltr">
          ▲ {row.step}
        </span>
        <span className="d-num inline-block min-w-[3ch] text-fg-3">{shortAgo(row.age, lang)}</span>
      </Link>
    </li>
  );
}

/** Marquee of the latest bid on every running lot; pauses on hover/focus. */
export function LiveTicker() {
  const rows = useTickerRows();
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const c = useCopy();
  const still = reduced || paused;

  return (
    <section aria-label={c("tickerLabel")} className="border-b border-line bg-surface/50">
      <Container className="flex h-11 items-center gap-3">
        <p className="d-label flex shrink-0 items-center gap-2 text-fg-2">
          <span aria-hidden="true" className="kz-live-dot" />
          <span className="hidden sm:inline">{c("tickerTitle")}</span>
        </p>
        <div
          className={`d-marquee-host d-fade-x relative min-w-0 flex-1 ${reduced ? "no-scrollbar overflow-x-auto" : "overflow-hidden"}`}
          data-paused={still ? "true" : "false"}
        >
          <div className={`flex w-max ${reduced ? "" : "d-marquee"}`} style={{ "--d-marquee-duration": `${Math.max(40, rows.length * 7)}s` }}>
            <ul className="flex shrink-0 items-center gap-5 pe-5">
              {rows.map((row) => (
                <TickerItem key={row.slug} row={row} />
              ))}
            </ul>
            {!reduced ? (
              <ul aria-hidden="true" inert className="flex shrink-0 items-center gap-5 pe-5">
                {rows.map((row) => (
                  <TickerItem key={row.slug} row={row} />
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        {!reduced ? (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? c("playTicker") : c("pauseTicker")}
            className="d-hit grid size-8 shrink-0 place-items-center rounded-md text-fg-3 transition-colors hover:bg-surface-2 hover:text-fg"
          >
            {paused ? <Play aria-hidden="true" className="size-3.5" /> : <Pause aria-hidden="true" className="size-3.5" />}
          </button>
        ) : null}
      </Container>
    </section>
  );
}
