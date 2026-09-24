import { BrowsePage } from "@/components/concept-a/pages/BrowsePage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("a", "browse", lang);
}

export default function Page() {
  return <BrowsePage />;
}
