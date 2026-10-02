import { SaudiCommerceBrowse } from "@/components/concept-d/saudi-commerce/browse/SaudiCommerceBrowse";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("d", "browse", lang);
}

// Browse in the approved Contemporary Saudi Commerce design, with the home
// page's own chrome (outside the (round2) group, so no earlier-prototype note).
export default function Page() {
  return <SaudiCommerceBrowse />;
}
