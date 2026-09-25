import { HubHome } from "@/components/concept-c/r3/HubHome";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "home", lang);
}

export default function Page() {
  return <HubHome />;
}
