import { BrowsePage } from "@/components/concept-c/pages/BrowsePage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "browse", lang);
}

export default function Page() {
  return <BrowsePage />;
}
