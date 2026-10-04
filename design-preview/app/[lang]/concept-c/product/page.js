import { VisualDiscoveryProduct } from "@/components/concept-c/visual-discovery/product/VisualDiscoveryProduct";
import { conceptMetadata } from "@/lib/meta";
import { FEATURED_PRODUCT } from "@/data/products";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "product", lang);
}

// Buy Now product detail in the approved Visual Discovery design,
// with the home page's own chrome (outside the (round2) group, so no
// earlier-prototype note). The bare /product address shows the featured
// product, as before.
export default function Page() {
  return <VisualDiscoveryProduct slug={FEATURED_PRODUCT} />;
}
