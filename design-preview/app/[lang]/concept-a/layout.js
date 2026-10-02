import "@/styles/concept-a.css";
import "@/styles/r3-premium-modern.css";
import { ConceptShell } from "@/components/shared/presentation/ConceptShell";

// The home, Browse and Auction pages render the approved Premium Modern design
// with their own shell (see page.js, browse/page.js and auction/); the other
// screens keep the Round 2 chrome through the (round2) route group until they
// are redesigned.
export default function ConceptLayout({ children }) {
  return (
    <ConceptShell concept="a" defaultTheme="light">
      {children}
    </ConceptShell>
  );
}
