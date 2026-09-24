import { LivePage } from "@/components/concept-b/pages/LivePage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("b", "live", lang);
}

export default function Page() {
  return <LivePage />;
}
