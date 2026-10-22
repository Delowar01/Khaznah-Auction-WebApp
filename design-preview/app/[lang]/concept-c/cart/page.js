import { VisualDiscoveryCart } from "@/components/concept-c/visual-discovery/cart/CartPage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "cart", lang);
}

export default function Page() {
  return <VisualDiscoveryCart />;
}
