import { LivePage } from "@/components/concept-a/pages/LivePage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("a", "live", lang);
}

export default function Page() {
  return <LivePage />;
}
