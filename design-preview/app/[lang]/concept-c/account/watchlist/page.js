import { WatchlistRedirect } from "@/components/concept-c/visual-discovery/account/AccountPage";
import { conceptMetadata } from "@/lib/meta";

// Production's legacy /account/watchlist: opens /account?tab=watchlist.
export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "account", lang);
}

export default function Page() {
  return <WatchlistRedirect />;
}
