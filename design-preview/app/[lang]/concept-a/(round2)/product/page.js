import { ProductPage } from "@/components/concept-a/pages/ProductPage";
import { conceptMetadata } from "@/lib/meta";
import { FEATURED_PRODUCT } from "@/data/products";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("a", "product", lang);
}

export default function Page() {
  return <ProductPage slug={FEATURED_PRODUCT} />;
}
