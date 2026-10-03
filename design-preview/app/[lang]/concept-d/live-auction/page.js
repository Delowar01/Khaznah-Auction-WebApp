import { SaudiCommerceLive } from "@/components/concept-d/saudi-commerce/live/SaudiCommerceLive";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("d", "live", lang);
}

// Live auction in the approved Contemporary Saudi design, with the home
// page's own chrome (outside the (round2) group, so no earlier-prototype note).
export default function Page() {
  return <SaudiCommerceLive />;
}
