import "@/styles/concept-c.css";
import "@/styles/r3-visual-discovery.css";
import { ConceptShell } from "@/components/shared/presentation/ConceptShell";

// The home, Browse and Auction pages render the approved Visual Discovery
// design with their own shell (see page.js, browse/page.js and auction/); the
// other screens keep the Round 2 chrome through the (round2) route group until
// they are redesigned.
export default function ConceptLayout({ children }) {
  return (
    <ConceptShell concept="c" defaultTheme="light">
      {children}
    </ConceptShell>
  );
}
