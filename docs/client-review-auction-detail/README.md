# Auction Detail redesign — screenshots (all four options)

Evidence for `CLIENT_REVIEW_AUCTION_DETAIL_REPORT.md` (repository root).

**How the images were made**

- Production build of the `design-preview/` app.
- The review lot `fridge-690`: a live auction that also offers Buy Now.
- Clock frozen at the same moment for every capture, so all countdowns
  match (5 h 40 min left).
- All images loaded, animations off, presentation bar hidden.
- Phones are captured with a window as tall as the page, so each option's
  fixed bid bar sits at the foot of the page, in the space the page keeps
  free for it, instead of across the content.

**What you will see that is not part of the design**

- The small dark tab at the side of every page reopens the hidden
  presentation bar. It belongs to the preview, not to the design.
- Bid panels that stay in view while scrolling (Options 1 and 4) appear
  once, at the top, in full-page captures.

## Full pages

| Option | 1440 px English | 1440 px Arabic | 390 px English | 390 px Arabic | 1024 px English |
|---|---|---|---|---|---|
| 1 · Modern Commerce (`concept-b`) | `option-1-1440-en.jpg` | `option-1-1440-ar.jpg` | `option-1-390-en.jpg` | `option-1-390-ar.jpg` | `option-1-1024-en.jpg` |
| 2 · Premium Modern Marketplace (`concept-a`) | `option-2-1440-en.jpg` | `option-2-1440-ar.jpg` | `option-2-390-en.jpg` | `option-2-390-ar.jpg` | `option-2-1024-en.jpg` |
| 3 · Visual Discovery Marketplace (`concept-c`) | `option-3-1440-en.jpg` | `option-3-1440-ar.jpg` | `option-3-390-en.jpg` | `option-3-390-ar.jpg` | `option-3-1024-en.jpg` |
| 4 · Contemporary Saudi Commerce (`concept-d`) | `option-4-1440-en.jpg` | `option-4-1440-ar.jpg` | `option-4-390-en.jpg` | `option-4-390-ar.jpg` | `option-4-1024-en.jpg` |

## Comparison sheet

`auction-detail-four-options-comparison.jpg` places the four 1440 px English
pages in a 2 × 2 grid.

- Each tile is the top 1,500 px of the page: header, lot head, gallery and
  the whole bid panel, including Buy Now.
- The full pages are the files above.
- The sheet shows that all four solve the same auction task with bidding
  first, that each looks different, and that each belongs to its own Home
  and Browse pages.

## Interaction evidence

`auction-detail-interaction-evidence.jpg` shows Option 2 (Premium Modern) in
English, captured while the interaction tests drive the page:

1. the bid confirmation dialog;
2. the maximum (proxy) bid saved, after the proxy answered a rival bid;
3. the Buy Now confirmation dialog;
4. an upcoming lot (`leather-sofa`): starts in, starting bid, Watch, no bid
   form;
5. a sold lot (`robot-vacuum`): sold for, winning bidder, bidding off, the
   way on to similar auctions;
6. the phone bid sheet at 390 px.

The same steps pass in all four options and both languages (report §I).

## Closeout

`auction-detail-closeout.jpg` shows the two closeout fixes
(`CLIENT_REVIEW_AUCTION_DETAIL_CLOSEOUT.md`):

1. Option 4's dual-lot card at 320 px before, with the heart over the end
   of its "Auction + Buy Now" tag;
2. the same card after: the tag stops short of the heart;
3. the foot of each option's Auction Detail phone page (390 px) with a
   toast above the bid bar.

The 20 full-page shots above were taken before the closeout. They show no
toast. Option 4's dual-lot card does not appear in them, because they
show `fridge-690` itself.
