"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { STATS } from "@/data/site";
import { formatNumber, RIYAL } from "@/lib/format";
import { Reveal } from "@/components/shared/ui/Reveal";
import { COPY } from "../copy";

function StatValue({ stat }) {
  if (stat.money) {
    return (
      <span dir="ltr" className="inline-flex items-baseline gap-1">
        <span className="text-[0.62em]">{RIYAL}</span>
        {stat.value}
        <span className="text-[0.62em]">{stat.suffixUnit}</span>
      </span>
    );
  }
  return (
    <span dir="ltr">
      {formatNumber(stat.value)}
      {stat.suffix || ""}
    </span>
  );
}

export function NumbersBand() {
  const { t } = useLang();
  return (
    <section aria-label={t(COPY.statsLine)} className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-[1360px] grid-cols-2 px-5 sm:px-6 lg:grid-cols-4 lg:px-10">
        {STATS.map((stat, index) => (
          <Reveal
            key={stat.key}
            delay={index * 80}
            className={`py-9 lg:py-12 ${index % 2 === 1 ? "border-s border-line ps-6" : "pe-6"} ${index >= 2 ? "border-t border-line lg:border-t-0" : ""} ${index > 0 ? "lg:border-s lg:border-line lg:ps-8" : ""}`}
          >
            <p className="a-display text-[40px] text-fg sm:text-[52px]">
              <StatValue stat={stat} />
            </p>
            <p className="mt-2 text-[13px] text-fg-2">{t(stat.label)}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
