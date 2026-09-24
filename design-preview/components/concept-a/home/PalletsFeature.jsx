"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { detailPath, getProduct, isAuction } from "@/lib/catalog";
import { BRAND_PHOTOS } from "@/data/media";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Button } from "../ui/Button";
import { COPY } from "../copy";

function PalletPlacard({ product }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const auction = isAuction(product);
  return (
    <Link href={link(detailPath(product))} className="group block rounded-card bg-surface/95 p-5 text-fg shadow-raised backdrop-blur transition-transform duration-500 hover:-translate-y-1">
      <p className="a-eyebrow !text-fg-3">
        {ui(auction ? "auction" : "buyNow")} · {pl("units", product.quantity)}
      </p>
      <p className="a-serif mt-2 text-[20px] leading-snug">{t(product.title)}</p>
      <div className="mt-4 flex -space-x-2 rtl:space-x-reverse">
        {product.palletContents.slice(0, 5).map((line) => (
          <span key={line.key} className="relative size-10 overflow-hidden rounded-full border-2 border-surface bg-plate">
            <Img image={line.image} alt="" sizes="40px" className="a-plate-img absolute inset-0 size-full object-contain p-1" />
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-fg-3 rtl:text-xs rtl:normal-case rtl:tracking-normal">{ui(auction ? "currentBid" : "price")}</p>
          <Money value={auction ? product.currentBid : product.price} className="a-serif text-[24px] leading-tight" symbolClassName="text-[0.8em]" />
        </div>
        <DirIcon icon={ArrowRight} className="size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </div>
    </Link>
  );
}

export function PalletsFeature() {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <section className="relative isolate overflow-hidden">
      <Img image={BRAND_PHOTOS.warehouseFloor} alt="" sizes="100vw" className="absolute inset-0 -z-10 size-full object-cover" />
      <div className="absolute inset-0 -z-10 from-black/85 via-black/60 to-black/20 ltr:bg-gradient-to-r rtl:bg-gradient-to-l" />
      <div className="mx-auto grid max-w-[1360px] items-end gap-12 px-5 py-24 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-32">
        <div className="text-white lg:col-span-6">
          <p className="a-eyebrow !text-white/70">{t({ en: "Bulk & pallets", ar: "الجملة والطبليات" })}</p>
          <h2 className="a-display mt-4 text-[38px] sm:text-[54px] rtl:sm:text-[46px]">{t(COPY.palletsTitle)}</h2>
          <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-white/80 rtl:leading-9">{t(COPY.palletsText)}</p>
          <Button as={Link} href={link("/browse?category=bulk-pallets")} variant="stage" size="lg" className="mt-9">
            {t(COPY.exploreBulk)}
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-6">
          <PalletPlacard product={getProduct("electronics-pallet")} />
          <PalletPlacard product={getProduct("kitchen-pallet")} />
        </div>
      </div>
    </section>
  );
}
