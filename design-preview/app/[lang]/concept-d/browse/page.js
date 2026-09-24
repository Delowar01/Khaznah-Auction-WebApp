import { BrowsePage } from "@/components/concept-d/pages/BrowsePage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("d", "browse", lang);
}

export default function Page() {
  return <BrowsePage />;
}
