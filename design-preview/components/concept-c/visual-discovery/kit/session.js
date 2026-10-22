"use client";

// The preview's simulated session for Option 3's customer pages (see
// PreviewStore). `ready` is false during the server render and hydration —
// production's auth "loading" — so a guarded page shows its loading state
// instead of flashing signed-in content to a signed-out visitor.
import { useStore } from "@/components/shared/providers/PreviewStore";
import { useHydrated } from "@/components/shared/ui/hooks";

export function useSession() {
  const { signedIn, setSignedIn } = useStore();
  const ready = useHydrated();
  return { ready, signedIn: ready && signedIn, setSignedIn };
}
