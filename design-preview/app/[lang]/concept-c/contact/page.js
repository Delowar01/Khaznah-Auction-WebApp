import { VisualDiscoveryContact } from "@/components/concept-c/visual-discovery/content/ContactPage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "contact", lang);
}

export default function Page() {
  return <VisualDiscoveryContact />;
}
