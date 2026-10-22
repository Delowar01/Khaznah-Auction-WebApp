import { VisualDiscoveryNotFound } from "@/components/concept-c/visual-discovery/content/NotFoundPage";

// Option 3's branded 404 when an Option 3 page calls notFound(). Addresses
// that match no route at all (/orders/1, /account/orders/{id}, unknown
// sellers, lots or paths) get the same page through app/global-not-found.js.
export default function NotFound() {
  return <VisualDiscoveryNotFound />;
}
