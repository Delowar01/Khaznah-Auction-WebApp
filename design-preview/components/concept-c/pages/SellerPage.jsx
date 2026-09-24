"use client";

import { getSeller } from "@/data/sellers";
import { SellerHero } from "../seller/SellerHero";
import { SellerAbout, SellerStats } from "../seller/SellerDetails";
import { StoreInventory } from "../seller/StoreInventory";
import { OtherSellers } from "../seller/OtherSellers";

export function SellerPage({ code }) {
  const seller = getSeller(code);
  return (
    <div>
      <SellerHero seller={seller} />
      <div className="c-container space-y-14 py-10 lg:space-y-16 lg:py-14">
        <SellerStats seller={seller} />
        <SellerAbout seller={seller} />
      </div>
      <StoreInventory seller={seller} />
      <OtherSellers current={seller.code} />
    </div>
  );
}
