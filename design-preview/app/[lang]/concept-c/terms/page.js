import { VisualDiscoveryPolicy } from "@/components/concept-c/visual-discovery/content/PolicyPage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "terms", lang);
}

export default function Page() {
  return <VisualDiscoveryPolicy kind="terms" />;
}
