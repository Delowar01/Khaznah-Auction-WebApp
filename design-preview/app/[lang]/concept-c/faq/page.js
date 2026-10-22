import { VisualDiscoveryFaq } from "@/components/concept-c/visual-discovery/content/FaqPage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "faq", lang);
}

export default function Page() {
  return <VisualDiscoveryFaq />;
}
