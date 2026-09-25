import "@/styles/concept-d.css";
import "@/styles/r3-auction.css";
import { ConceptShell } from "@/components/shared/presentation/ConceptShell";

// Round 3A: the home page renders its own Round 3 shell (see page.js); the
// other screens keep the Round 2 chrome through the (round2) route group
// until Round 3B replaces them.
export default function ConceptLayout({ children }) {
  return (
    <ConceptShell concept="d" defaultTheme="light">
      {children}
    </ConceptShell>
  );
}
