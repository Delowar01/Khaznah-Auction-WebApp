import { Chrome } from "@/components/concept-d/Chrome";
import { PrototypeNotice } from "@/components/shared/presentation/PrototypeNotice";

// Round 2 chrome for the screens that the approved home page designs have not
// replaced yet, under a note that marks them as earlier prototypes.
export default function Round2Layout({ children }) {
  return (
    <>
      <PrototypeNotice concept="d" />
      <Chrome>{children}</Chrome>
    </>
  );
}
