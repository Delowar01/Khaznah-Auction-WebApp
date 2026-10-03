# Khaznah — Live Auction redesign, all four options

Phase D of the client review pack. The live auction room (`/live-auction`)
now uses each option's approved Home, Browse and Auction Detail design. The
four rooms share one behaviour layer on top of the existing simulated live
event. Each option has its own layout, stage, current-lot treatment, bid
console, activity, lot queue, upcoming events and phone treatment.

- **Review links** (on the Vercel preview of this branch):
  - Option 1: `/en/concept-b/live-auction`
  - Option 2: `/en/concept-a/live-auction`
  - Option 3: `/en/concept-c/live-auction`
  - Option 4: `/en/concept-d/live-auction`
  - Arabic: replace `/en/` with `/ar/`.
- **Screenshots:** `docs/client-review-live-auction/` (20 review shots, the
  four-option comparison and the interaction evidence sheet; see its
  README).
- **Paths** below are relative to `design-preview/` unless they start at the
  repository root.
- **Amounts:** the pages show the Saudi riyal sign (⃁); this report writes
  "SAR" except where it quotes a label exactly.
- **The 320 px overflow is CLOSED.** The live page is 0 px wider than the
  screen at every width from 1920 to 320 px, in English and Arabic, in all
  four options; on phones (390, 360 and 320 px) it stays at 0 px through
  bidding, the hammer and the next lot (§P). No page-level
  `overflow-x: hidden` was used.
- **One engine bug was fixed.** Rival bidders never bid in the old live
  room: a timer was restarted every second and never fired. A 13-line fix
  in `lib/useLiveEvent.js` (§B, §C) brings them back, with the same delays,
  odds and amounts. The live panels on the four Home pages use the same
  engine, so their bid now moves when a rival bids, as originally intended.
- **Nothing else was redesigned.** Home, Browse and Auction Detail keep their
  design (§S). The other inner pages change only the wording of their
  "Earlier prototype" note, which now names Live auction as new.

---

## A. Baseline

- **Branch:** `claude/magical-faraday-fne4kq`.
- **Starting commit:** `5364a5a` ("Close Auction Detail mobile QA issues").
- **Checks before editing:**
  - HEAD was exactly `5364a5a`;
  - HEAD matched `origin/claude/magical-faraday-fne4kq`;
  - the working tree was clean.
- **Comparison build:** a production build of `5364a5a` in a separate
  worktree, served next to the new build. Every before/after figure in this
  report compares those two builds.
- **Final commit:** the commit that adds this report, "Redesign live auction
  for all four Khaznah concepts". A report cannot contain its own hash;
  `git log -1 --format=%H -- CLIENT_REVIEW_LIVE_AUCTION_REPORT.md` prints it.

**Live Auction before this change**

- **Option 1** (`concept-b`): the Option 1 live page
  (`pages/LivePage.jsx` → `live/LiveView.jsx`), on Option 1's own
  components.
- **Options 2–4** (`concept-a`, `concept-c`, `concept-d`): Round 2
  prototypes under the `(round2)` route group, labelled "Earlier
  prototype". Their `live/*.jsx` files were recoloured copies of Option 1's
  structure. As the brief asked, they were used for function only, never as
  a visual reference.
- **One engine:** all four rooms, and the live panels on all four Home
  pages, run `lib/useLiveEvent.js`.

## B. Existing functionality audit

The audit was written before any implementation. The four old rooms behaved
the same, so one table covers them. "Kept" means the behaviour is in all
four new rooms.

| Area | Live Auction at `5364a5a` | New Live Auction |
|---|---|---|
| Route | `/live-auction` per option, EN and AR, pre-rendered. Options 2–4 under `(round2)`, with the Round 2 chrome and the "Earlier prototype" note. | **Kept** for Option 1. Options 2–4 move to their own route with their Home/Browse chrome and no note (§C). |
| Event identity | LIVE badge, event title (H1), presenter, "Hosted by" with a link to the host's seller page (`/seller/REDSEA`), audience count that drifts. | **Kept** in all four, plus the lot on the block ("Lot 5 of 10") and the sale's progress ("4 of 10 lots done"). |
| Stage | A still of the warehouse floor, LIVE, audience, "Connected", the presenter's lower third, the lot number, the hammer card. No video player. | **Kept and redrawn** per option on its approved live photograph (§H). Still no player. |
| Current lot | Photo, "Lot 5 of 10", title, grade, market saving, current or opening bid, bid count, note, "Lot closes in Ns", time bar, Going once / Going twice badge, Up next. | **Kept.** The call is written out at every stage (Open for bids → Going once → Going twice → Closing) and the clock has one spoken phrase. |
| Bidding | Current or opening bid, minimum next bid, three quick bids (minimum, +1 increment, +3 increments, each labelled "Bid ⃁ X"), the main Bid. **One tap, no confirm step.** Toast "Bid placed — you're the highest bidder"; state box (highest, outbid, won). | **Kept:** still one tap, the same amounts, the same toast. The main Bid now shows its exact amount ("Bid ⃁ 1,875"). Between lots the buttons stay in place, unavailable, showing the next lot's opening amounts (§I). |
| Rival bidders | Meant to try every 2.8–7 s, less often once the price passes the market price; an outbid toast. **Broken: never fired** (below). | **Fixed** in the engine with the smallest change; the same delays, odds, amounts, bidder names and toast. |
| Late-bid extension | Engine rule: any bid with less than 12 s left puts the clock back to 12 s. The old page said nothing about it, and its rules line was the timed auction's ("a bid in the last 5 minutes extends by 5 minutes"). | **Rule unchanged.** Each room shows "Late bid — clock back to 12s" for four seconds, tells screen readers, and states the live rule ("A bid in the final 12 seconds puts the clock back to 12 seconds.") (§J). |
| Hammer and intermission | Hammer on the last second: "Sold!", "Sold to you" or "Not sold"; the title and amount; "Waiting for the next lot" with no countdown; a "You won" toast; a 6 s pause; the next lot goes live by itself; after lot 10 the sale starts again from lot 5. | **Kept.** "Not sold — reserve not met" names the reason; the pause shows "Next lot in 6s" counting down, with the next lot's name (§J). |
| Activity | Newest first; your rows marked "You"; amount and how long ago; a scrollable list that can be reached by keyboard; emptied for each new lot. | **Kept**, styled per option. Each row also has one spoken sentence (§K). |
| Lots in sale | A table: number, item and photo, starting bid (from 640 px), status (Live now, Sold for X, Not sold, Up next, Upcoming). | **Kept** as each option's own list; no wide table on phones; the lot on the block is the current step (§L). |
| Upcoming events | Two cards: title, host, lots, a ticking "Starts in", Remind me (`aria-pressed`) with a toast only when switched on. | **Kept**, with a toast both ways ("Reminder removed" added) and the start time spoken in words. **The 320 px overflow came from these cards** and is fixed (§M, §P). |
| Phones | Stage and lot first; Bid / Activity / Lots as a segmented control (buttons with `aria-pressed`, not tabs); a fixed bar with the current bid and Bid. | **Kept and redesigned** per option: real tabs (arrow keys, Home / End, mirrored in Arabic) and a fixed live bid bar with the lot clock; toasts stay clear of it (§N). |
| EN / AR, RTL | Yes. | **Yes**, reviewed per option (§O). |
| Static export | Pre-rendered. | **Kept** (§C). |

**Problems found in the old room, all fixed:**

1. **Rival bids never arrived** (an engine bug). The rival-bidder timer
   listed the clock (`remaining`) among its dependencies. The clock changes
   every second, so the 2.8–7 s timer was cancelled and restarted every
   second and never fired. Watched for 60 s on `5364a5a`: no rival bid; the
   recliner was hammered at its opening ⃁ 1,850; lot 6 ran 45 s without a
   bid and was not sold. So "outbid", the outbid toast, rival rows in the
   activity and late extensions by rivals never happened, and the Home live
   panels never moved.
2. **320 px overflow** from the "More live & upcoming" cards (§P).
3. **Not real tabs:** the phone sections were toggle buttons.
4. **Toasts over the bar from 768 to 1023 px:** the toast lift applied only
   below 768 px, but the old bar showed up to 1023 px.
5. **Wording:** the wait between lots had no number; the late-bid rule was
   the timed auction's; there was no wording for a late extension or for a
   reminder being removed.

**Kept as found (engine unchanged):** the engine's "closing" phase (0 s) is
never reached, because the hammer falls on that tick. The rooms show the
final second — after rival bidding has stopped, when only you can still
extend the lot — as "Closing". This is presentation only.

## C. Architecture

**Shared behaviour, concept-specific visuals.** Nothing visual is shared
between the options apart from what each option already took from its own
Home, Browse and Auction Detail. No component switches on the option.

### Engine (`lib/useLiveEvent.js`): one bug fix

- **The fix:** the rival timer no longer depends on the clock. It reads the
  clock when it fires (as it already did), and each attempt arms the next
  one through a counter (`rivalTurn`). 13 lines in all; the comment in the
  file explains why.
- **Unchanged:** delays (2.8–7 s), odds (85 %, 55 % or 25 % depending on
  price against market), amounts, bidder names, the outbid toast, the
  hammer, the pause, the order of lots and the loop.
- **Also:** `INTERMISSION` (6 s) and `EXTEND_TO` (12 s) are exported, so the
  rooms state the rule the engine applies instead of repeating the numbers.
- **Proof:** in all four options and both languages, the flow test sees a
  rival bid arrive, the outbid state and a late extension (§I, §J), and the
  lot-sequence test sees lot 5 sold to a rival and lot 8 lost to a rival
  after your bid (§J).
- **Effect on Home:** the four Home live panels run the same engine, so a
  rival bid now moves their price. No Home code changed (§S).

### Shared layer (`components/shared/live/`, new)

| File | What it does |
|---|---|
| `hooks.js` | Behaviour only. `useLiveRoom`: everything a room shows, ready to render — the event (title, presenter, host and link, audience, deposit, progress), the lot on the block, the call (open, going once, going twice, closing, between lots) with its words and tone, the lot clock (seconds, spoken phrase, time bar), the late-bid notice, the hammer result and the wait, the bidder's state, the three one-tap amounts and the minimum next bid (the next lot's opening amounts between lots), `bid()` and the exact spoken label of every Bid button. `useAnnouncements` (screen-reader messages), `useFeedRows`, `useLotQueue`, `useLiveTabs` (phone tabs), `useEventReminders`, `useUpcomingEvents`, `useToastsAwayFromConsole`. |
| `copy.js` | The new strings, English and Arabic: the call, the clock, the late-bid notice and rule, the hammer results, the wait, the tabs, the spoken sentences, "Reminder removed". Everything else reuses `data/ui.js`. |
| `LiveAnnouncer.jsx` | Two visually hidden live regions: urgent (the call, the hammer, the next lot going live) and polite (a late extension). |

Reused from the Auction Detail layer (`components/shared/auction/`): the
accessible tabs (`useTabs`), the spoken duration and the measured toast
clearance for fixed bid bars (`useToastClearance`). There is no second toast
system.

### Toasts (`components/shared/ui/Toaster.jsx`)

- **Bottom offset:** `--kz-toast-bottom` now applies at every width, not only
  on phones. Only pages that set it are affected: Auction Detail sets it
  below 768 px (its bar is hidden from 768 px), so it behaves exactly as
  before; the live rooms set it below 1024 px, where their bar is shown.
- **Side:** from 768 px the stack sits at the end side, as before, unless a
  page sets `--kz-toast-align`. The live rooms set it to the start side while
  they are open, so a bid, outbid or won toast never lands on the bid
  console. Leaving the page removes it.
- **Checked:** the Auction Detail toast check (§S) and the live toast checks
  (§N).

### Option folders

- **Option 1:** `components/concept-b/live/` (rewritten in place; Option 1's
  Home still uses its `EventCard.jsx` and `useEventReminders.js`, which are
  unchanged).
- **Option 2:** `components/concept-a/premium-modern/live/` (new).
- **Option 3:** `components/concept-c/visual-discovery/live/` (new).
- **Option 4:** `components/concept-d/saudi-commerce/live/` (new).

Each new folder has a page shell (the option's Home header, menu, cart,
newsletter and footer), `LiveView`, `Stage`, the bid console, the lists,
`Upcoming` and `PhoneBar`, each written for that option.

### Routes

- **Option 1:** unchanged route (`app/[lang]/concept-b/live-auction`).
- **Options 2–4:** the route moves out of the `(round2)` group to
  `app/[lang]/concept-{a,c,d}/live-auction/page.js`, so it gets the option's
  Home/Browse chrome and no "Earlier prototype" note. Page titles are
  unchanged ("Live auction — 2 · Premium Modern Marketplace · Khazna").
- **Theme before paint:** the pre-paint script in `app/[lang]/layout.js`
  now also marks the Options 2–4 live routes as new-design pages, so they
  load in their light design without a flash.

### Presentation status

- The start page tags **Home, Browse, Auction and Live auction** as "New
  design" for Options 2–4; its notes and fact chip say the same (EN and AR).
- The presentation bar lists Home, Browse, Auction and Live auction first
  for Options 2–4, then the earlier prototypes, and shows **Light only** on
  the live page. Option 1's bar is unchanged.
- The live pages of Options 2–4 no longer carry the "Earlier prototype"
  note. Product, Seller and Components keep it, with the wording now naming
  Home, Browse, Auction and Live auction as the new pages.
- `CLIENT_PREVIEW_GUIDE.md` and `design-preview/README.md` say the same.
- Checked by `.scratch/la/smoke.mjs` on the final build: the note on
  Product, Seller and Components of Options 2–4 (EN and AR; 1440, 390 and 320 px) with the new
  wording; the live page in every option with one H1, the new-design marker
  and no note; the start page's tags and fact chip; the bar's order, current
  page and Light only; and the toast placement set on the live page and
  cleared after leaving it: **88 / 88 passed**.

### Builds (final tree)

All on the code in the final commit:

- `npm run lint`: no errors, no warnings.
- `npm run build`: compiled; 335 / 335 pages generated; no warnings.
- `STATIC_EXPORT=1 npm run build` (output `out/`): compiled; 335 / 335
  pages; no warnings. All **8** live pages exist as files (4 options × 2
  languages). Served as plain files on a static server
  (`.scratch/la/export-smoke.mjs`), each one loads with its H1 (and the
  new-design marker in Options 2–4), takes a one-tap bid (the Bid moves to
  ⃁ 1,900), hammers the lot and opens lot 6 by itself (Bid ⃁ 400), switches
  the phone tabs and sets a reminder with its toast, with no overflow at
  390 px and no console errors: **8 / 8 passed**.
- The normal build was restored afterwards.

## D. Option 1 — Modern Commerce (`concept-b`)

**The idea: a control room.** Navy and indigo, dense and practical, like
Option 1's Browse and Auction Detail.

- **Desktop:** a navy event bar (LIVE, the title, presenter and host, then
  read-outs for audience, lot, progress and connection). Below it, two
  columns: the stage with the current-lot strip under it, and the bid
  console with the activity log under it. The running order of all ten lots
  runs full width below; other live events last.
- **Stage:** the warehouse-floor still in a 16:9 frame with LIVE, the
  audience, "Connected", the presenter's lower third with the host's avatar,
  and the lot number. Between lots, a white hammer card on a navy veil.
- **Current-lot strip:** photo, "Current lot · Lot 5 of 10", title (H2),
  grade, market saving, note, the bid and bid count; then the call chip, the
  late-bid chip, "Lot closes in 27s", a time bar coloured by the call and
  "Up next".
- **Bid console:** a navy head with the call, the lot number and the clock as
  minute and second cells; then the bid and minimum next bid, your state
  (with an icon and words), three one-tap amounts, the main indigo Bid with
  its amount, and the live rules.
- **Activity:** a log with initials, "You" rows on indigo, amounts and ages.
- **Lots:** a numbered grid (one column on phones, two from 640 px, five
  across on desktop) with a status rule and the status in words.
- **Upcoming:** two event rows with the start time, host, lots and Remind me.
- **Phones:** event bar, stage, lot strip, then Bid / Activity / Lots as a
  segmented tab strip; a 76 px fixed bar with the bid, the clock and Bid.

## E. Option 2 — Premium Modern Marketplace (`concept-a`)

**The idea: an auction house's live room.** Ivory, charcoal and restrained
brass, with editorial type and fine rules, like Option 2's Home, Browse and
Auction Detail.

- **Desktop:** an editorial title block (the brass dash, a small red LIVE
  NOW, the audience, the H1, presenter, host and progress). The cinematic
  stage and the charcoal console meet edge to edge as one frame, so bidding
  sits beside the picture. Below: the lot on the block as a catalogue entry
  on the warm panel, then the sale as a catalogue beside the bid book, then
  the next sales.
- **Stage:** the approved warehouse-aisle photograph (B9) with a small red
  LIVE tag, the audience, the connection, the presenter's lower third with
  the host, and the lot number. Between lots, an ivory hammer card.
- **Console:** charcoal, with the call, what is on the block, the clock
  ("0:27") over a brass time rule, the bid and minimum next bid, your state,
  three one-tap amounts and the brass Bid with its amount, then the rules.
- **Lot band:** the cut-out on stone, the lot number set large ("05 / 10"),
  the title (H2), grade, note, and the figures: bid, market price, up next.
  Below 1024 px it also carries the call and the clock.
- **Bid book:** fine-ruled lines, newest first; your bids carry a brass rule
  and "You" in bronze.
- **Sale:** a numbered catalogue of all ten lots, each with its cut-out, its
  status in words and its result.
- **Upcoming:** refined catalogue cards with the start time in bronze.
- **Phones:** title block, stage, lot band, then underlined Bid / Activity /
  Lots tabs with the brass rule; a 72 px ivory bar with the bid, the clock
  and the charcoal Bid.

## F. Option 3 — Visual Discovery Marketplace (`concept-c`)

**The idea: an immersive live marketplace.** White, navy, indigo, gold and
coral, rounded and image-led, like Option 3's Home, Browse and Auction
Detail.

- **Desktop:** a full-width navy band frames the room: breadcrumb, LIVE NOW
  and audience pills, the display H1 and the host in gold. In the band, a
  large rounded stage beside the white bid card. Below on white: every lot
  as a visual tile, the bid chat beside the next sales.
- **Stage:** the approved electronics-floor photograph (B10) with the coral
  lot clock and the call, LIVE, the audience, the connection and the
  presenter's pill. The expressive lot card (cut-out on a blue-grey plate,
  number, title, grade, bid) floats over the stage's corner from 768 px and
  sits under the stage on phones. Between lots, a white hammer card on a
  navy veil.
- **Bid card:** the call chip and the coral clock pill, what is on the
  block, the bid in large display figures, the minimum next bid, your state
  as a pill, three pale one-tap pills and the indigo Bid pill with its
  amount, then the rules.
- **Bid chat:** rival bids as white bubbles at the start, yours as indigo
  bubbles at the end, newest first.
- **Lots:** rounded tiles on pastel plates with the number and a status
  chip, five across on desktop; a compact list on phones.
- **Upcoming:** image-led rounded tiles with a reminder pill.
- **Phones:** the navy band holds the stage and the lot card; then pill tabs
  (Bid / Activity / Lots) and a floating navy pill bar (64 px, 12 px above
  the bottom) with the coral clock, the bid and the gold Bid.

## G. Option 4 — Contemporary Saudi Commerce (`concept-d`)

**The idea: a clean Saudi live-auction room.** Cream, green and sage,
structured and calm, with red used sparingly (LIVE and the lot clock), like
Option 4's Home, Browse and Auction Detail.

- **Desktop (1200 px and up):** a sage event panel (LIVE NOW, the audience,
  "Connected", the H1, then the presenter, host, progress and deposit as
  facts with icons). Below, three columns: the running order of every lot;
  the stage, the lot facts and the activity; and the framed bid panel, which
  stays in view while the middle column scrolls. From 1024 to 1199 px: stage
  and facts beside the bid panel, over the running order and the activity.
- **Stage:** the approved warehouse aisle with the lot on the block standing
  in it (the Home page's live scene), the red lot clock on white, LIVE, the
  audience, the connection, the presenter with the host and the lot number.
  Between lots, a white hammer card.
- **Bid panel:** a sage head with the call and the red clock; the bid and
  minimum next bid; your state; three one-tap amounts; the green Bid with
  its amount; the rules on sage.
- **Lot facts:** the cut-out, "Current lot · Lot 5 of 10", the title (H2),
  grade, saving, note, the bid and up next. The figures sit in their own
  column only when the panel is wide enough (a container query), so the
  title always has room.
- **Running order:** a numbered stepper joined by a line: sold (a check and
  the price), not sold, live now (the row tinted, the number in red), up
  next (a green ring), upcoming.
- **Activity:** ruled rows with initials; your rows on sage with "You" in
  green.
- **Upcoming:** practical rows: what, who, how many lots, when, Remind me.
- **Phones:** the event panel (progress and deposit move to the running
  order and bid panel), stage, lot facts, then square Bid / Activity / Lots
  tabs; a 74 px white bar with the bid, the red clock and the green Bid.

### Why the four read differently

| | Option 1 | Option 2 | Option 3 | Option 4 |
|---|---|---|---|---|
| Room | Control room | Auction-house live room | Immersive marketplace | Structured Saudi room |
| Desktop composition | Event bar; [stage + lot strip │ console + log]; lots grid | Title block; [stage ═ console] as one frame; lot band; [catalogue │ bid book] | Navy band with [stage + floating lot card │ bid card]; tiles; [chat │ next sales] | Event panel; [running order │ stage, facts, activity │ sticky bid panel] |
| Stage | Warehouse still, 16:9, navy overlays | Aisle photograph, cinematic, meets the console | Electronics floor, large and rounded, coral clock | Aisle with the lot standing in it, red clock |
| Bid console | Navy head with clock cells, indigo Bid | Charcoal, brass rule, brass Bid | White rounded card, display figures, indigo pill | Framed panel, sage head, green Bid |
| Activity | Log with indigo own rows | Fine-ruled bid book | Chat bubbles | Ruled rows on sage |
| Lot queue | Five-across grid with status rules | Numbered catalogue | Visual tiles | Stepper with a line |
| Phone bar | 76 px, white | 72 px, ivory | Floating navy pill | 74 px, white |

## H. Live stage

- **No fake video player.** Each stage is a still photograph with the live
  information on it: no timeline, no play button, no audio, no external
  stream. Options 2–4 use their option's approved live photograph (B9 aisle,
  B10 electronics floor, B9 aisle with the lot on the block); Option 1 keeps
  its warehouse still. No new images were made.
- **On every stage:** LIVE as text, the audience ("1,284 watching", which
  drifts), "Connected" (from 640 px in Options 1–2, from 768 px in Options
  3–4), the presenter and "Hosted by", and the lot number. The stage is a labelled region ("Live stage") with its own
  heading for screen readers.
- **Hammer card:** between lots it covers the stage with the result ("Sold!",
  "Sold to you" or "Not sold — reserve not met"), the lot, the amount, "Next
  lot in 6s" counting down and the next lot's name, with a thin line running
  down. It fades in; with reduced motion it no longer rises or scales, it
  only fades.
- **Verified in real time** (not only on a test clock) in all four options at
  1440 px: the card appears fully opaque over the stage when the lot closes.

## I. Bidding

- **One tap, as before.** The audit showed the live room never had a
  confirm step, so none was added: the amount on the button is the bid. The
  rooms say so ("One tap bids the amount shown — there is no confirm step in
  the live room.").
- **What the bidder sees:** the current bid (or the opening bid before the
  first bid), the minimum next bid, three one-tap amounts (minimum, +1
  increment, +3 increments) and the main Bid with the exact amount on it
  ("Bid ⃁ 1,875"). The price flashes briefly when it moves.
- **States:** "You're the highest bidder", "You've been outbid" and "You won
  this auction" appear in the console with an icon, words and their own colour,
  never colour alone. The success, outbid and won toasts are announced by
  the toast region.
- **Between lots:** the buttons stay where they are, unavailable
  (`aria-disabled`, so keyboard focus is never lost), showing the next lot's
  opening amounts. The main Bid reads "Next lot in 6s".
- **Labels:** every Bid button carries its exact amount for screen readers,
  e.g. "Bid 1,875 Saudi riyals" / "زايد بـ 1,875 ريال سعودي".
- **Flow test** (`.scratch/la/flow.mjs`, brief steps 1–29, all four options,
  EN and AR, on the page's own timers on a test clock with the rivals
  steered): load with one H1; LIVE; audience; presenter and host link; the
  recliner on the block; current bid ⃁ 1,850; Bid ⃁ 1,875; three labelled
  quick bids; a one-tap bid with no dialog; the bid moves to ⃁ 1,875 and the
  Bid to ⃁ 1,900; "You ⃁ 1,875" in the activity; the highest state and toast;
  a rival's ⃁ 1,900 arrives; the outbid state and toast; a late bid puts the
  clock back to 12 s with the notice; Going once at 10 s or less; Going twice
  at 5 s or less; Closing, then the hammer; "Sold to you" for ⃁ 1,925; the
  won state and toast; the wait with the countdown running down; lot 6 live
  by itself; the controls reset (opening ⃁ 400, Bid ⃁ 400, no state); the
  queue shows lot 5 sold and lot 6 live; Up next is lot 7; the activity
  empties and then shows the rival's opening bid; a reminder on and off with
  both toasts; the host link opens `/seller/REDSEA`; no console errors.
  **Result: 240 / 240** (30 checks × 4 options × 2 languages).
  In the first run on the final build, step 28 failed in Option 2 (EN and
  AR): the "Bid placed" toast from step 9, which never leaves while the test
  clock is paused, sat over the Remind me button. The test now switches it
  off from the keyboard when the button is covered, and Option 2 passes
  60 / 60. In real time, with the pointer, the reminder switches on and off
  at once in all four options, EN and AR, at 1440 and 390 px
  (`.scratch/la/remind-real.mjs`: **16 / 16**).

## J. Countdown, late bids and the hammer

- **The call, in words at every stage:** "Open for bids" (more than 10 s
  left), "Going once" (10–6 s), "Going twice" (5–2 s), "Closing" (the final
  second), then the hammer. The clock and its bar are calm, then amber, then
  red; nothing blinks or pulses.
- **Screen readers** hear each change of call once, with the time ("Going
  once. Lot closes in 10 seconds."), the hammer result with the amount, and
  the next lot going live with its opening bid. The clock itself is not a
  live region, so it does not chatter every second.
- **Late bids:** the engine's rule is unchanged (a bid with less than 12 s
  left puts the clock back to 12 s). Each room shows "Late bid — clock back
  to 12s" for four seconds, the call goes back to "Open for bids", and
  screen readers hear "Late bid. The lot clock is back to 12 seconds." The
  rule is stated under the Bid button.
- **Hammer and the pause:** "Sold!" (to a rival, with the amount), "Sold to
  you" (with the amount and the won state) or "Not sold — reserve not met".
  The 6 s pause shows "Next lot in 6s" counting down and the next lot's
  name; the next lot then goes live by itself with a clean slate.
- **Lot-sequence test** (`.scratch/la/sequence.mjs`, all four options, EN
  and AR): lot 5 sells to a rival; lot 6 gets no bid and is not sold; lot 7
  is sold to you for ⃁ 90; lot 8 sells to a rival after your bid. At every
  new lot the test checks that nothing from the last lot remains: title,
  photo, opening bid and Bid amount, bid count, your state, the clock (back
  to 45 s), the queue and the activity. **Result: 320 / 320** (40 checks
  × 4 options × 2 languages).

## K. Activity

- Newest first; each row shows who (initials and "Bidder 7Q3", or "You"),
  the amount and how long ago. Your rows are distinct in each option's own
  way (indigo row, brass rule, indigo bubble at the end, sage row) and say
  "You" in words.
- Each row has one spoken sentence ("You bid 1,875 Saudi riyals").
- The list is a labelled region that can be reached with Tab and scrolled
  with the keyboard; it scrolls inside its panel, so it never pushes the bid
  away. "No bids on this lot yet." when a lot opens; emptied for each lot.
- On phones it is the Activity tab, so it never takes over the screen.

## L. Lot queue

- All ten lots in order with their status in words: Sold for ⃁ X, Not sold,
  Live now, Up next, Upcoming (with the starting bid). The lot on the block
  is the current step (`aria-current="step"`) in an ordered list.
- Each option draws it its own way (§D–§G); none is a wide table, and all
  fit 320 px.
- On phones it is the Lots tab.
- The sequence test checks the queue at every lot change (§J).

## M. Upcoming events and reminders

- Two other live sales, each with its picture, title, host, number of lots
  and a ticking "Starts in 2d 5h" (spoken as "2 days 5 hours").
- **Remind me** is a toggle button (`aria-pressed`, described by the event
  title): switching on shows "Reminder set", switching off shows "Reminder
  removed" (new), both with the event's title, in EN and AR. It is local to
  the preview; nothing is sent anywhere.
- **The 320 px overflow came from these cards** (§P); the new cards wrap
  their text and fit 320 px in all four options.

## N. Mobile

- **Order on phones:** event identity, stage, the current lot, then the
  Bid / Activity / Lots tabs, then the next sales. The stage and the lot on
  the block are always above the tabs.
- **Tabs:** real tabs with tab semantics (`tablist`, `tab`, `tabpanel`,
  `aria-selected`, `aria-controls`), arrow keys (mirrored in Arabic), Home
  and End. From 1024 px all three sections show together, without tab
  semantics.
- **Fixed live bid bar** below 1024 px, in each option's style: the current
  bid (or the result between lots), the lot clock and Bid with the exact
  next amount. Between lots the Bid is unavailable and reads "Next lot in
  6s". The safe area is respected, and the page keeps the bar's height free
  under the footer so nothing ends up behind it.
- **Toasts never cover the bar:** the bar is measured
  (`useToastClearance`), and toasts sit 12 px above it on phones and
  tablets.
- **Phone test** (`.scratch/la/mobile.mjs`, 390, 360 and 320 px, EN and AR,
  all four options, 20 checks each): zero overflow on load; stage and
  current lot shown; three tabs in order; Bid selected first; Activity and
  Lots tabs show their sections; arrow keys (mirrored in Arabic) and Home /
  End; the bid toast, the outbid toast and the won toast each clear of the
  bar; the bar shows the new bid; the bar between lots; zero overflow with
  the hammer card; the bar on the next lot (Bid ⃁ 400); the next lot's
  heading; the reminder toast clear of the bar; the footer clear of the bar;
  zero overflow at the end; no console errors. **Result: 480 / 480** (20
  checks × 4 options × 2 languages × 3 widths).

## O. English and Arabic (RTL)

- Every new string has an Arabic version (`components/shared/live/copy.js`);
  everything else comes from the existing Arabic copy.
- The layouts use logical properties, so they mirror properly in Arabic:
  the event header, badges, audience, overlays, the lot, the clock, the
  console, quick bids, the activity (your bubbles move to the other side in
  Option 3), the lot order, the next-lot line, the tabs and the upcoming
  cards.
- Photos and cut-outs are never mirrored. Amounts and clock digits stay
  left to right inside Arabic text.
- Arabic uses each option's Arabic font and line heights; long Arabic titles
  wrap instead of being cut.
- All tests in this report run in both languages.

## P. Responsive

- **The 320 px overflow is CLOSED.**
  - *Cause:* the old "More live & upcoming" card was a flex row (96 px image
    and text) inside a grid cell with no `min-width: 0`, and its "Starts in
    2d 4h" line could not wrap. Its smallest width was about 316 px against
    288 px of room at 320 px, so the whole page scrolled sideways and the
    fixed bar widened with it.
  - *Fix:* new cards in each option, built to shrink (`min-w-0` grid
    tracks, text that wraps). No `overflow-x: hidden` on the page or body.
  - *Proof:* the sweep and the phone test measure 0 px of overflow at every
    width (below).
- **Sweep** (`.scratch/la/sweep.mjs`, 1920, 1440, 1366, 1280, 1200, 1024,
  768, 480, 430, 390, 360 and 320 px, EN and AR, all four options): no page
  overflow, nothing past the edge of the screen, no console errors, no
  broken images, the Bid visible and inside the screen, from 1024 px the
  main Bid fully visible on a 900 px tall screen on load, and below 1024 px
  nothing hidden under the fixed bar at the end of the page. **Result:
  96 / 96** (12 widths × 2 languages × 4 options). On desktop the main
  Bid's lower edge is between 691 and 849 px from the top of the window on
  load.
- **Clipped text** (`.scratch/la/clip.mjs`, same widths): no text drawn
  past its box, no box squeezed to nothing, no heading squeezed into a
  sliver. **Result: 96 / 96**.
- **Overlaps** (`.scratch/la/overlap.mjs`, same widths): no text or control
  overlapping another. **Result: 96 / 96**.
- **Found and fixed during this QA:** at 1200–1365 px, Option 4's lot facts
  put the figures in a third column of a narrow panel, which squeezed the
  title (to nothing in English at 1200 px). The figures now take their own
  column only when the panel is at least 640 px wide (a container query).

## Q. Accessibility

- **Axe** (`.scratch/la/axe.mjs`, WCAG 2.1 A/AA rules, all four options, EN
  and AR, 1440 px on load, after a bid and at the hammer; 390 px on load and
  on the Activity tab, the Lots tab and the hammer): **0 serious or
  critical issues in 56 scans** (4 options × 2 languages × 7 states).
  - *Found and fixed:* Option 4's red "Live now" in the running order was
    4.4:1 on its pale red row; it now uses the option's deeper red (5.2:1).
- **Structure:** one H1 (the event title); the stage, the current lot, the
  bid console, the activity, the lots and the upcoming events are labelled
  sections with headings; the current lot has its own H2.
- **LIVE** is text, not only a red dot. The audience is text.
- **Bid buttons:** the quick bids are a labelled group; every Bid button
  carries its exact amount. Unavailable buttons use `aria-disabled` and stay
  focusable.
- **States** (highest, outbid, won, sold, not sold, live now, up next) are
  always words, with icons or rules, never colour alone.
- **Countdown:** one spoken phrase ("Lot closes in 27 seconds") instead of
  digits; the call changes, late extensions, the hammer and the next lot are
  announced once each.
- **Activity:** keyboard reachable and scrollable, one sentence per row.
- **Lot sequence:** an ordered list with the current step marked.
- **Tabs:** full tab semantics and keyboard support on phones and tablets.
- **Reminders:** toggle buttons with `aria-pressed`, described by the event
  title.
- **Focus:** each option's focus ring is visible on its dark and light
  surfaces (a light ring on navy, charcoal and indigo areas). No traps.
- **Reduced motion:** when it is requested, the existing global rule cuts
  the price flash and the CSS transitions (time bars, the hammer progress
  line) to nothing, and Motion (`reducedMotion="user"`) drops the slide and
  scale of the late-bid chip, the hammer card and the activity rows,
  leaving only short fades.

## R. Performance

Network weight of `/en/concept-*/live-auction`, scrolled to the end
(`.scratch/la/perf.mjs`), `5364a5a` against the final build:

| Option | Build | JS | CSS | Images at 1440 px | Images at 390 px | Fonts | DOM nodes |
|---|---|---|---|---|---|---|---|
| 1 | `5364a5a` | 1,101 KB | 240 KB | 13 · 197 KB | 4 · 71 KB | 175 KB | 767 |
| 1 | new | 1,138 KB (+37) | 257 KB | 13 · 197 KB | 4 · 71 KB | 175 KB | 884 |
| 2 | `5364a5a` | 1,195 KB | 248 KB | 13 · 197 KB | 4 · 71 KB | 283 KB | 784 |
| 2 | new | 1,303 KB (+108) | 265 KB | 14 · 562 KB | 4 · 115 KB | 329 KB | 811 |
| 3 | `5364a5a` | 1,202 KB | 251 KB | 13 · 197 KB | 4 · 71 KB | 229 KB | 787 |
| 3 | new | 1,260 KB (+58) | 267 KB | 14 · 546 KB | 4 · 109 KB | 353 KB | 798 |
| 4 | `5364a5a` | 1,204 KB | 251 KB | 13 · 197 KB | 4 · 71 KB | 296 KB | 793 |
| 4 | new | 1,280 KB (+76) | 267 KB | 15 · 629 KB | 4 · 115 KB | 199 KB | 748 |

(Bytes of the response bodies from the local production server, the same
method for both builds. Images: count · total.)

- **No new libraries, no second engine.** The rooms use the existing
  engine, Motion, icons and overlays.
- **JavaScript:** Option 1 grows by 37 KB (the shared live layer and its new
  components). Options 2–4 grow by 58–108 KB: like their Auction Detail,
  they now load their Home/Browse shell (header, menu and cart layers,
  newsletter, footer) instead of the lighter Round 2 chrome, plus their own
  live components.
- **Images (desktop):** Options 2–4 load 350–430 KB more. Each stage uses
  the option's approved live photograph (101–117 KB at 960 px), and the lot
  lists show the cut-out photos that Browse and Auction Detail use (17–66 KB
  each; only a 600 px version of each cut-out exists, and no new image files
  were made). Option 4 also stands the 600 px recliner cut-out in its stage
  (67 KB). Only the stage photo loads eagerly; everything else is lazy.
- **Images (phones):** the lot lists sit in the Lots tab, so their pictures
  load only when that tab is opened: 109–115 KB on load against 71 KB.
- **Fonts:** each option now loads its Home/Browse fonts (Option 4 lighter,
  Options 2–3 heavier than their Round 2 fonts).
- **Renders and timers:** no new timers. The engine's one-second clock
  re-renders the room as before; everything the room shows is worked out
  during that render. The only new effects set two CSS variables (toast
  placement) and follow one media query (tabs).

## S. Regression

Against `5364a5a`, on the final build:

- **Home, Browse and Auction Detail look the same.**
  `.scratch/nav/regress-chrome.mjs` captures each page in full on both
  builds with the same frozen clock, seeded randomness and loaded images,
  and compares them pixel by pixel in three bands (header, content,
  footer): Home, Browse, Auction Detail on the dual lot (`fridge-690`) and
  on a timed lot (`dishwasher`), English and Arabic, at 1440, 1024, 390 and
  320 px — 32 pairs per option, **128** in all.
  - **127 / 128 identical.**
  - The one pair that differed, Option 4's English Home at 1024 px, by 49 px
    at the edges of the seller-directory pictures, is load noise: the
    baseline compared with itself on that page differs by 8 and 42 px in
    two runs, and the new build compared with the baseline again differs by
    0 and 0 px. The same page showed the same noise in earlier phases.
- **The engine fix on the Home pages.** In those captures the Home live
  panels match, because the first rival attempt comes 2.8–7 s after load.
  Left open, the panels now move: with the rival odds steered so that every
  attempt bids, each Home shows a new amount (⃁ 1,925) within 10 s on the
  new build and no change on `5364a5a` (`.scratch/la/home-rivals.mjs`, all
  four options). This is the intended behaviour; no Home code changed.
- **Option 4's card closeout stays fixed.** `.scratch/ad/card-check.mjs`
  (the dual lot's card on Browse and in Auction Detail's similar auctions,
  EN and AR, 320–1440 px): the sale tag never runs under the heart, and the
  card's pixels are unchanged from `5364a5a`: **36 / 36 passed**.
- **Auction Detail's toast clearance still works.**
  `.scratch/ad/toast-check.mjs` (all four options, EN and AR, 390, 360 and
  320 px: Watch, Share, a placed bid, a saved maximum bid, Buy Now, stacked
  toasts): every toast 12 px above the bid bar, fully on screen and not
  covering Bid; on desktop the toasts stay 24 px from the end corner; on
  Browse phones 16 px from the bottom; the lift is removed after leaving
  the page: **28 / 28 passed**.
- **Presentation, switching and navigation.** The start page, the bar and
  the notes pass the smoke test (§C, 88 / 88). The header and footer bands
  are identical in all 128 pairs above, so the auction-first navigation is
  unchanged. Concept switching code is unchanged.
- **Other inner pages.** Product, Seller and Components of Options 2–4
  change only in the wording of their note. `/system` keeps its known
  320 px overflow, identical before and after (§U).

## T. Files changed

**New**

- `components/shared/live/`: `hooks.js`, `copy.js`, `LiveAnnouncer.jsx`.
- `components/concept-b/live/`: `EventBar.jsx`, `LotQueue.jsx`,
  `MobileLiveBar.jsx`, `UpcomingEvents.jsx`, `tones.js`.
- `components/concept-a/premium-modern/live/`: `PremiumModernLive.jsx`,
  `LiveView.jsx`, `Stage.jsx`, `Console.jsx`, `LotBand.jsx`, `Lists.jsx`,
  `Upcoming.jsx`, `PhoneBar.jsx`.
- `components/concept-c/visual-discovery/live/`: `VisualDiscoveryLive.jsx`,
  `LiveView.jsx`, `Stage.jsx`, `BidCard.jsx`, `Lists.jsx`, `Upcoming.jsx`,
  `PhoneBar.jsx`.
- `components/concept-d/saudi-commerce/live/`: `SaudiCommerceLive.jsx`,
  `LiveView.jsx`, `Stage.jsx`, `BidPanel.jsx`, `Panels.jsx`, `Upcoming.jsx`,
  `PhoneBar.jsx`.
- `app/[lang]/concept-{a,c,d}/live-auction/page.js`.
- `docs/client-review-live-auction/` (repository root): 20 screenshots, the
  comparison, the evidence sheet and a README.
- `CLIENT_REVIEW_LIVE_AUCTION_REPORT.md` (repository root): this report.

**Changed**

- `lib/useLiveEvent.js`: the rival-bidder fix; `INTERMISSION` and
  `EXTEND_TO` exported (§C).
- `components/concept-b/live/`: `LiveView.jsx`, `LiveStage.jsx`,
  `CurrentLot.jsx`, `LiveBidPanel.jsx`, `ActivityFeed.jsx` (rewritten).
- `components/shared/ui/Toaster.jsx`: the bottom offset at every width and
  the optional side (§C).
- `components/shared/auction/hooks.js`: comment only (`useToastClearance`).
- `app/[lang]/layout.js`: the pre-paint route pattern.
- `app/[lang]/concept-{a,c,d}/layout.js`, and `Header.jsx` and `Layers.jsx`
  in `components/concept-{a,c,d}/…/`: comments only.
- `lib/routes.js`: `NEW_DESIGN_PAGES` adds `live`; the presentation bar and
  the start page follow it. `PresentationBar.jsx`: comment.
- `components/shared/presentation/PrototypeNotice.jsx` and
  `selector-copy.js`: the wording names Live auction (EN and AR).
- `design-preview/README.md`, `CLIENT_PREVIEW_GUIDE.md` (repository root):
  Live auction listed as a new-design page.

**Removed**

- `app/[lang]/concept-{a,c,d}/(round2)/live-auction/page.js` (replaced by
  the new routes).
- `components/concept-b/live/LotsTable.jsx` (replaced by `LotQueue.jsx`).

**Not changed:** `data/*` (the live event, its ten lots and the other
events), the shared UI primitives other than the Toaster, every Home,
Browse and Auction Detail component (apart from comments), the Product,
Seller and Components pages (apart from their note's wording), and Option
1's `live/EventCard.jsx` and `live/useEventReminders.js` (used by its
Home).

## U. Known limitations

- **Sample data and simulation.** The audience, rival bidders, results and
  activity come from the existing simulated engine and sample data;
  reminders live in the page only. No backend capability was added or
  implied.
- **A photograph, not a stream.** Each stage is a still photograph with the
  live information on it. A production version would put the presenter's
  video there; no player was imitated.
- **Demo pacing, unchanged:** lots run 45 s (the first one 27 s from page
  load), with a 6 s pause, and after lot 10 the sale starts again from
  lot 5. In production the presenter starts each lot.
- **"Closing"** is the final second of a lot, because the engine never
  reaches its own 0 s "closing" phase. Presentation only.
- **The Home live panels now move.** With rival bids working again, the
  bid in the four Home pages' live panels changes as rivals bid. That was
  always the intended behaviour; no Home code changed (§S).
- **Shorter laptop screens.** On a 1440 × 900 window (presentation bar
  hidden) the main Bid is fully visible on load in all four options. On a
  768 px tall window, the main Bid of Options 1 and 4 can start just below
  the fold (by 1 to 81 px, depending on width and language); a short scroll
  brings it up. The presentation bar, when shown, adds its own height.
- **Heavier images in Options 2–4** (§R): the cut-out photos used in their
  lot lists exist only at 600 px. Smaller versions could be made later; no
  image files were added in this phase.
- **Round 2 live components are now unrouted:**
  `components/concept-{a,c,d}/live/*` and
  `components/concept-{a,c,d}/pages/LivePage.jsx` (27 files). They are kept
  for a later cleanup with the other Round 2 files (the unrouted Round 2
  Home band still imports them).
- **QA method.** Interaction tests drive the page's own timers on
  Playwright's test clock, with the rival odds steered; screenshots use a
  frozen clock and seeded randomness. Motion's fades do not run while the
  test clock is paused, so the hammer card, toasts and reminders were also
  checked in real time, and the interaction evidence sheet was captured in
  real time. In a real browser the rival bids are random, so each run
  differs.
- **Out of scope, unchanged:** Product Detail, Seller, Cart, Checkout,
  Account and Components remain earlier prototypes in Options 2–4. The known
  `/system` overflow at 320 px is the same before and after (Option 1:
  10 / 42 px in EN / AR; Option 2: 11 / 52; Option 3: 17 / 42; Option 4:
  0 / 68).

## Self-review

1. **Does it feel live?** Yes, more than before: the call changes in words,
   rival bids now arrive and move the price, the activity fills, a late bid
   visibly puts the clock back, and the hammer card counts down to the next
   lot. The limit is the still photograph in place of video.
2. **Is bidding obvious?** Yes. Each room has one primary Bid with the exact
   amount on it, three one-tap amounts beside it, and the minimum next bid
   next to the current bid. On phones the Bid is always in the fixed bar.
3. **Are the lot and its bid clear?** Yes. The lot is named on the stage, in
   the current-lot section (its own heading) and in the console; the current
   bid is the largest figure in the console.
4. **Is the time clear?** Yes: seconds on each option's clock, the call in
   words, a time bar or a coloured clock, and "Closing" for the last second.
5. **Are Going once and Going twice understandable?** Yes: written out at
   every stage, calm → amber → red, announced once each for screen readers;
   nothing blinks.
6. **Are the hammer and the pause understandable?** Yes: the result and the
   amount on the stage and in the console, "Next lot in 6s" counting down,
   the next lot's name, and the Bid buttons visibly unavailable.
7. **Does the next lot arrive naturally?** Yes: it goes live by itself; the
   queue marker moves, Up next changes, the activity empties and the
   controls reset. The sequence test found nothing left over from the last
   lot.
8. **Is the activity secondary?** Yes: beside or below the bidding on
   desktop, in its own tab on phones, scrolling inside its panel.
9. **Is the lot queue useful?** Yes: results so far, the live lot, what is
   next and the starting bids, in a form that suits each option and fits
   320 px.
10. **Does each room match its Home, Browse and Auction Detail?** Yes: each
    uses its option's header, footer, type, colours, buttons, cards and
    imagery from those pages; nothing is borrowed across options.
11. **Are the four distinct?** Yes: different compositions, stages,
    consoles, activity, queues and phone bars (§G), not recolours.
12. **Is the Arabic intentional?** Yes: every new string is written in
    Arabic, the layouts mirror while photos and digits do not, the options'
    Arabic fonts and line heights are used, and every test ran in Arabic.
13. **Is bidding on a 320 px phone excellent?** It is solid: no overflow,
    the clock, the amount and Bid always in the fixed bar, real tabs, and
    toasts above the bar. The bar is compact at 320 px (Option 3 drops its
    gavel icon below 380 px to keep the amount whole), so a check on real
    phones is still worthwhile.
