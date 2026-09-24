"use client";

import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { detailPath, discountPercent, isNewListing } from "@/lib/catalog";
import { LotImage } from "../ui/LotImage";
import { OverlayChip, DeltaChip, LotTag } from "../ui/Chips";
import { GradeChip } from "../ui/GradeChip";
import { StockMeter } from "../ui/Meters";
import { WatchButton } from "../ui/Actions";
import { CardShell, CardTitle } from "./CardShell";

/** Buy Now card: fixed price (mono), discount delta, stock meter. */
export function BuyNowCard({ product, priority = false, sizes }) {
  const { link } = useConcept();
  const { t, ui } = useLang();
  const soldOut = product.stock <= 0;
  const pct = discountPercent(product);
  const chip = soldOut ? "unavailable" : isNewListing(product) ? "new" : "buyNow";

  return (
    <CardShell>
      <div className="d-card-media relative aspect-[5/4]">
        <LotImage
          image={product.images[0]}
          alt={t(product.title)}
          priority={priority}
          sizes={sizes || "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"}
          fill
          className={soldOut ? "opacity-70 grayscale" : ""}
        />
        <div className="absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
          <OverlayChip status={chip} label={chip === "new" ? ui("justListed") : undefined} />
          <WatchButton product={product} className="relative z-[2] size-9" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex min-h-6 flex-wrap items-center gap-1.5">
          <LotTag lot={product.lot} />
          <GradeChip grade={product.grade} size="sm" />
        </div>
        <CardTitle href={link(detailPath(product))} className="mt-2.5">
          {t(product.title)}
        </CardTitle>

        <div className="mt-auto pt-4">
          <p className="d-label text-fg-3">
            {ui("price")}
            {product.unitLabel ? <span className="normal-case tracking-normal"> · {t(product.unitLabel)}</span> : null}
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <Money value={product.price} className={`d-num text-lg font-medium sm:text-xl ${soldOut ? "text-fg-2" : "text-fg"}`} />
            {pct > 0 ? (
              <>
                <Money value={product.originalPrice} strike className="d-num text-xs text-fg-3" />
                <DeltaChip percent={pct} tone="down" className="h-5" />
              </>
            ) : null}
          </div>
        </div>
        <StockMeter stock={product.stock} className="mt-3 border-t border-line pt-3" compact />
      </div>
    </CardShell>
  );
}
