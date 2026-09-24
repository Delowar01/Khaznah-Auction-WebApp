import { LivePage } from "@/components/concept-d/pages/LivePage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("d", "live", lang);
}

export default function Page() {
  return <LivePage />;
}
