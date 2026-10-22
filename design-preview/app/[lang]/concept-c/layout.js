import "@/styles/concept-c.css";
import "@/styles/r3-visual-discovery.css";
import { ConceptShell } from "@/components/shared/presentation/ConceptShell";

// Option 3 — Visual Discovery, the selected master design. The approved
// home, Browse, Auction, Live auction and Product pages render their own
// shell (see page.js, browse/page.js, auction/, live-auction/ and
// product/); every other customer page uses the shared Option 3 kit
// (components/concept-c/visual-discovery/kit: VDPage or AuthShell).
export default function ConceptLayout({ children }) {
  return (
    <ConceptShell concept="c" defaultTheme="light">
      {children}
    </ConceptShell>
  );
}
