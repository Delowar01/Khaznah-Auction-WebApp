import { VisualDiscoveryCheckout } from "@/components/concept-c/visual-discovery/checkout/CheckoutPage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "checkout", lang);
}

export default function Page() {
  return <VisualDiscoveryCheckout />;
}
