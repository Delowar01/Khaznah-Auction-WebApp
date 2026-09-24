import { SystemPage } from "@/components/concept-d/pages/SystemPage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("d", "system", lang);
}

export default function Page() {
  return <SystemPage />;
}
