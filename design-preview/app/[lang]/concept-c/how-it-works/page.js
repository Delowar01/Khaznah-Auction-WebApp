import { VisualDiscoveryHowItWorks } from "@/components/concept-c/visual-discovery/content/HowItWorksPage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "howItWorks", lang);
}

export default function Page() {
  return <VisualDiscoveryHowItWorks />;
}
