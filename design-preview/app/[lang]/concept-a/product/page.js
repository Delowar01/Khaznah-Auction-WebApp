import { PremiumModernProduct } from "@/components/concept-a/premium-modern/product/PremiumModernProduct";
import { conceptMetadata } from "@/lib/meta";
import { FEATURED_PRODUCT } from "@/data/products";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("a", "product", lang);
}

// Buy Now product detail in the approved Premium Modern design,
// with the home page's own chrome (outside the (round2) group, so no
// earlier-prototype note). The bare /product address shows the featured
// product, as before.
export default function Page() {
  return <PremiumModernProduct slug={FEATURED_PRODUCT} />;
}
