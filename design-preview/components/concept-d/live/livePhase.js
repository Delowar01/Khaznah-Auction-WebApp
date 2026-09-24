// Presentation of the live-lot phases from useLiveEvent().

export const PHASE_TONE = {
  live: "ink",
  going_once: "warning",
  going_twice: "danger",
  closing: "danger",
  intermission: "muted",
};

export const PHASE_TEXT = {
  live: "d-ink",
  going_once: "text-warning",
  going_twice: "text-live",
  closing: "text-live",
  intermission: "text-fg-3",
};

/** Label for the lot clock: on the block · going once · going twice · closing. */
export function phaseLabel(phase, ui, c) {
  if (phase === "going_once") return ui("goingOnce");
  if (phase === "going_twice") return ui("goingTwice");
  if (phase === "closing") return ui("closingNow");
  if (phase === "intermission") return c("hammerSold");
  return c("lotLive");
}
