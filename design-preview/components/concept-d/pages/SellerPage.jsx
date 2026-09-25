"use client";

import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { FEATURED_SELLER, getSeller } from "@/data/sellers";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { StoreAbout } from "../seller/StoreAbout";
import { StoreHeader } from "../seller/StoreHeader";
import { StoreInventory } from "../seller/StoreInventory";

function SellerView({ seller }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  return (
    <div className="pb-16">
      <div className="kb-container py-3">
        <Breadcrumbs items={[{ label: ui("home"), href: link("/") }, { label: ui("sellers") }, { label: t(seller.name) }]} />
      </div>
      <StoreHeader seller={seller} />
      <StoreInventory seller={seller} />
      <StoreAbout seller={seller} />
    </div>
  );
}

export function SellerPage({ code }) {
  const seller = getSeller(code) || getSeller(FEATURED_SELLER);
  // Keyed by seller so filters and search reset between storefronts.
  return <SellerView key={seller.code} seller={seller} />;
}
