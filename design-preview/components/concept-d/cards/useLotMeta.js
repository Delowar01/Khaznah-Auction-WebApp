"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { ITEM_TYPES, SOURCE_TYPES } from "@/data/grades";
import { getSeller } from "@/data/sellers";
import { discountPercent, isNewListing } from "@/lib/catalog";
import { COPY } from "../copy";

/** Shared, display-ready facts about a lot for every card and row variant. */
export function useLotMeta(product) {
  const { t, pl } = useLang();
  const seller = getSeller(product.seller);

  let typeLine;
  if (product.itemType === "pallet" && product.quantity) {
    typeLine = t(COPY.fullPallet, { units: pl("units", product.quantity) });
  } else if (product.itemType === "bulk" && product.quantity) {
    typeLine = t(COPY.carton, { units: pl("units", product.quantity) });
  } else if (product.itemType === "bulk") {
    typeLine = t(ITEM_TYPES.bulk);
  } else {
    typeLine = t(SOURCE_TYPES[product.source]);
  }

  return {
    title: t(product.title),
    seller,
    sellerName: seller ? t(seller.name) : "",
    typeLine,
    discount: discountPercent(product),
    isNew: isNewListing(product),
    image: product.images[0],
  };
}
