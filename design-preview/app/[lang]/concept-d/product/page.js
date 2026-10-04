import { SaudiCommerceProduct } from "@/components/concept-d/saudi-commerce/product/SaudiCommerceProduct";
import { conceptMetadata } from "@/lib/meta";
import { FEATURED_PRODUCT } from "@/data/products";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("d", "product", lang);
}

// Buy Now product detail in the approved Contemporary Saudi Commerce design,
// with the home page's own chrome (outside the (round2) group, so no
// earlier-prototype note). The bare /product address shows the featured
// product, as before.
export default function Page() {
  return <SaudiCommerceProduct slug={FEATURED_PRODUCT} />;
}
