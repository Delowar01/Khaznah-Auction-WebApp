import { VisualDiscoveryAbout } from "@/components/concept-c/visual-discovery/content/AboutPage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "about", lang);
}

export default function Page() {
  return <VisualDiscoveryAbout />;
}
