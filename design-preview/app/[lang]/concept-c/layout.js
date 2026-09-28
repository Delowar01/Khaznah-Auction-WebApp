import "@/styles/concept-c.css";
import "@/styles/r3-visual-discovery.css";
import { ConceptShell } from "@/components/shared/presentation/ConceptShell";

// The home page renders the approved Visual Discovery design with its own
// shell (see page.js); the other screens keep the Round 2 chrome through the
// (round2) route group until the inner pages are redesigned.
export default function ConceptLayout({ children }) {
  return (
    <ConceptShell concept="c" defaultTheme="light">
      {children}
    </ConceptShell>
  );
}
