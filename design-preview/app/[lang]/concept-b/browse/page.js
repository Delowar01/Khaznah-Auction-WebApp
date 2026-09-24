import { BrowsePage } from "@/components/concept-b/pages/BrowsePage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("b", "browse", lang);
}

export default function Page() {
  return <BrowsePage />;
}
