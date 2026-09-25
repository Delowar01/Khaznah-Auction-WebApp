"use client";

import { useId } from "react";
import { RailControls, RailTrack, useRail } from "../ui/Rail";
import { SectionHeader } from "../ui/SectionHeader";
import { LotCard } from "./LotCard";

/** Titled horizontal rail of lot cards (related, similar, more from seller). */
export function LotRail({ title, subtitle, products, href, icon, anchor, className = "" }) {
  const id = useId();
  const { trackRef, ...rail } = useRail();
  if (!products.length) return null;
  return (
    <section id={anchor} aria-labelledby={id} className={`scroll-mt-40 ${className}`}>
      <SectionHeader id={id} icon={icon} title={title} subtitle={subtitle} href={href} actions={<RailControls rail={rail} />} />
      <RailTrack trackRef={trackRef} label={title}>
        {products.map((product) => (
          <li key={product.slug} className="w-[46%] shrink-0 sm:w-[31%] lg:w-[calc((100%-48px)/5)]">
            <LotCard product={product} />
          </li>
        ))}
      </RailTrack>
    </section>
  );
}
