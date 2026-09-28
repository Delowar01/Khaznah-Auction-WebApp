import { PremiumModernHome } from "@/components/concept-a/premium-modern/PremiumModernHome";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("a", "home", lang);
}

export default function Page() {
  return <PremiumModernHome />;
}
