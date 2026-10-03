# Live Auction redesign — screenshots (all four options)

Evidence for `CLIENT_REVIEW_LIVE_AUCTION_REPORT.md` (repository root).

**How the images were made**

- Production build of the `design-preview/` app, route `/live-auction`.
- The sale as it opens: lot 5 of 10, the Mid-Century Leather Recliner, on
  the block.
- Clock frozen at the same moment for every capture, so every lot clock
  reads the same second.
- Randomness seeded, so the audience figure matches across captures.
- All images loaded, animations off, presentation bar hidden.
- Phones are captured with a window as tall as the page. Each option's
  fixed live bid bar therefore sits at the foot of the page, in the space
  the page keeps free for it, instead of across the content.

**What you will see that is not part of the design**

- The small dark tab at the side of every page reopens the hidden
  presentation bar. It belongs to the preview, not to the design.
- Option 4's bid panel stays in view while the page scrolls on desktop. In
  a full-page capture it appears once, at the top.

## Full pages

| Option | 1440 px English | 1440 px Arabic | 1024 px English | 390 px English | 390 px Arabic |
|---|---|---|---|---|---|
| 1 · Modern Commerce (`concept-b`) | `option-1-1440-en.jpg` | `option-1-1440-ar.jpg` | `option-1-1024-en.jpg` | `option-1-390-en.jpg` | `option-1-390-ar.jpg` |
| 2 · Premium Modern Marketplace (`concept-a`) | `option-2-1440-en.jpg` | `option-2-1440-ar.jpg` | `option-2-1024-en.jpg` | `option-2-390-en.jpg` | `option-2-390-ar.jpg` |
| 3 · Visual Discovery Marketplace (`concept-c`) | `option-3-1440-en.jpg` | `option-3-1440-ar.jpg` | `option-3-1024-en.jpg` | `option-3-390-en.jpg` | `option-3-390-ar.jpg` |
| 4 · Contemporary Saudi Commerce (`concept-d`) | `option-4-1440-en.jpg` | `option-4-1440-ar.jpg` | `option-4-1024-en.jpg` | `option-4-390-en.jpg` | `option-4-390-ar.jpg` |

## Comparison sheet

`live-auction-four-options-comparison.jpg` places the four 1440 px English
pages in a 2 × 2 grid.

- Each tile is the top 1,300 px of the page: the header, the event, the
  stage, the bid console and the start of the lot list.
- The full pages are the files above.
- The sheet shows that all four put the stage and bidding together on the
  first screen, that each looks different, and that each belongs to its own
  Home, Browse and Auction Detail pages.

## Interaction evidence

`live-auction-interaction-evidence.jpg` shows Option 2 (Premium Modern) in
English. It was captured in real time on the production build, with the
page's own timers running normally; only the rival bidders' random odds
were steered, to decide when a rival bids:

1. open for bids;
2. your one-tap bid: you are the highest bidder;
3. a rival bids: you are outbid;
4. going once;
5. going twice;
6. a late bid puts the clock back to 12 seconds;
7. the hammer: sold to you;
8. between lots: the next-lot countdown;
9. the next lot goes live with a clean slate;
10. the phone: Bid / Activity / Lots tabs and the fixed live bid bar.

The same steps pass in all four options and both languages (report §I–§J).
