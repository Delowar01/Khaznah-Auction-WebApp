import { PremiumModernLive } from "@/components/concept-a/premium-modern/live/PremiumModernLive";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("a", "live", lang);
}

// Live auction in the approved Premium Modern design, with the home page's
// own chrome (outside the (round2) group, so no earlier-prototype note).
export default function Page() {
  return <PremiumModernLive />;
}
