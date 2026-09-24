"use client";

import { notFound } from "next/navigation";
import { getSeller } from "@/data/sellers";
import { StoreHero } from "../seller/StoreHero";
import { StoreFacts } from "../seller/StoreFacts";
import { StoreInventory } from "../seller/StoreInventory";

export function SellerPage({ code }) {
  const seller = getSeller(code);
  if (!seller) notFound();
  return (
    <>
      <StoreHero seller={seller} />
      <StoreFacts seller={seller} />
      <StoreInventory seller={seller} />
    </>
  );
}
