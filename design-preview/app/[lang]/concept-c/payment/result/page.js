import { VisualDiscoveryPaymentResult } from "@/components/concept-c/visual-discovery/payment/ResultPage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "paymentResult", lang);
}

export default function Page() {
  return <VisualDiscoveryPaymentResult />;
}
