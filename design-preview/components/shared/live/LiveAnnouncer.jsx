"use client";

/**
 * The live room's spoken updates for screen readers (no visible output):
 * the call, the hammer and the next lot interrupt (assertive); a late bid
 * putting the clock back waits its turn (polite). Messages come from
 * useLiveRoom's `announce`; each changes only when its event happens.
 */
export function LiveAnnouncer({ announce }) {
  return (
    <>
      <p className="sr-only" aria-live="assertive" aria-atomic="true">
        {announce.urgent}
      </p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announce.polite}
      </p>
    </>
  );
}
