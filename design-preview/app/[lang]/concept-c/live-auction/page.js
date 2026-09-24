import { LivePage } from "@/components/concept-c/pages/LivePage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "live", lang);
}

export default function Page() {
  return <LivePage />;
}
