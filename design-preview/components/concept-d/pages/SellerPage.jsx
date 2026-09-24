"use client";

import { getSeller, FEATURED_SELLER } from "@/data/sellers";
import { Container } from "../ui/Layout";
import { SellerHero } from "../seller/SellerHero";
import { SellerOverview } from "../seller/SellerOverview";
import { StoreInventory } from "../seller/StoreInventory";
import { OtherSellers } from "../seller/OtherSellers";

export function SellerPage({ code }) {
  const seller = getSeller(code) || getSeller(FEATURED_SELLER);
  return (
    <>
      <SellerHero seller={seller} />
      <Container className="pt-8">
        <SellerOverview seller={seller} />
        <StoreInventory seller={seller} />
        <OtherSellers current={seller.code} />
      </Container>
    </>
  );
}
