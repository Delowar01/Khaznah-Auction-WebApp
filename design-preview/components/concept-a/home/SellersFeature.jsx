"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { SELLERS } from "@/data/sellers";
import { BRAND_PHOTOS } from "@/data/media";
import { Img } from "@/components/shared/ui/Img";
import { SellerRow } from "../cards/SellerRow";
import { SectionHead } from "../ui/Type";
import { COPY } from "../copy";

export function SellersFeature() {
  const { t, ui } = useLang();
  return (
    <section id="sellers" className="mx-auto grid max-w-[1360px] scroll-mt-32 gap-12 px-5 py-20 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-28">
      <figure className="relative lg:col-span-5">
        <div className="relative aspect-[4/5] overflow-hidden rounded-card">
          <Img image={BRAND_PHOTOS.warehouseRiyadh} alt="" sizes="(min-width: 1024px) 38vw, 100vw" className="absolute inset-0 size-full object-cover object-[35%_center]" />
        </div>
        <figcaption className="mt-3 text-[12px] text-fg-3">{ui("verifiedSeller")} · {ui("inspected")}</figcaption>
      </figure>
      <div className="lg:col-span-7">
        <SectionHead eyebrow={ui("sellers")} title={t(COPY.sellersTitle)} text={t(COPY.sellersText)} align="stack" />
        <div className="mt-10">
          {SELLERS.map((s) => (
            <SellerRow key={s.code} seller={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
