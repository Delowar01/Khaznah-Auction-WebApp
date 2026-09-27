import { DiscoveryHome } from "@/components/concept-d/discovery/DiscoveryHome";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("d", "home", lang);
}

export default function Page() {
  return <DiscoveryHome />;
}
