import { VisualDiscoveryMoyasar } from "@/components/concept-c/visual-discovery/payment/MoyasarPage";
import { SAMPLE_PAYMENT } from "@/data/checkoutSamples";
import { conceptMetadata } from "@/lib/meta";

// The preview has one payment record (the one checkout reserves).
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: String(SAMPLE_PAYMENT.id) }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "payment", lang);
}

export default async function Page({ params }) {
  const { id } = await params;
  return <VisualDiscoveryMoyasar id={id} />;
}
