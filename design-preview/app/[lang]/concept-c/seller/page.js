import { VisualDiscoverySeller } from "@/components/concept-c/visual-discovery/seller/SellerView";
import { conceptMetadata } from "@/lib/meta";
import { FEATURED_SELLER, getSeller } from "@/data/sellers";
import { tr } from "@/lib/i18n";

// Production has no /seller index (inventory A.3) and no public seller list.
// The approved Option 3 header and home link "Sellers" here, so the preview
// keeps its existing stand-in — the featured seller's storefront — rather
// than inventing a directory. Owner/API decision logged in
// OPTION3_COMPLETE_CUSTOMER_WEBSITE_REPORT.md.
export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "seller", lang, tr(getSeller(FEATURED_SELLER)?.name, lang));
}

export default function Page() {
  return <VisualDiscoverySeller seller={getSeller(FEATURED_SELLER)} />;
}
