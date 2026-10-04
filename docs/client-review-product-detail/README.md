# Buy Now Product Detail redesign — screenshots (all four options)

Evidence for `CLIENT_REVIEW_PRODUCT_DETAIL_REPORT.md` (repository root).

**How the images were made**

- Production build of the `design-preview/` app, route
  `/product/task-lamp` (the featured product, also shown at `/product`):
  the Adjustable Task Lamp, SAR 189 (was 249), 14 in stock, Grade A, sold
  by Rawabi Home Outlet.
- Clock frozen at the same moment for every capture, so the auction cards
  in the lists show the same time left.
- Randomness seeded; all images loaded; animations off; presentation bar
  hidden.
- Phones are captured with a window as tall as the page. Each option's
  fixed purchase bar therefore sits at the foot of the page, in the space
  the page keeps free for it, instead of across the content.

**What you will see that is not part of the design**

- The small dark tab at the side of every page reopens the hidden
  presentation bar. It belongs to the preview, not to the design.
- On desktop the purchase panel of Options 1 and 4 stays in view while the
  page scrolls. In a full-page capture it appears once, at the top.

## Full pages

| Option | 1440 px English | 1440 px Arabic | 1024 px English | 390 px English | 390 px Arabic |
|---|---|---|---|---|---|
| 1 · Modern Commerce (`concept-b`) | `option-1-1440-en.jpg` | `option-1-1440-ar.jpg` | `option-1-1024-en.jpg` | `option-1-390-en.jpg` | `option-1-390-ar.jpg` |
| 2 · Premium Modern Marketplace (`concept-a`) | `option-2-1440-en.jpg` | `option-2-1440-ar.jpg` | `option-2-1024-en.jpg` | `option-2-390-en.jpg` | `option-2-390-ar.jpg` |
| 3 · Visual Discovery Marketplace (`concept-c`) | `option-3-1440-en.jpg` | `option-3-1440-ar.jpg` | `option-3-1024-en.jpg` | `option-3-390-en.jpg` | `option-3-390-ar.jpg` |
| 4 · Contemporary Saudi Commerce (`concept-d`) | `option-4-1440-en.jpg` | `option-4-1440-ar.jpg` | `option-4-1024-en.jpg` | `option-4-390-en.jpg` | `option-4-390-ar.jpg` |

## Comparison sheet

`product-detail-four-options-comparison.jpg` places the four 1440 px
English pages in a 2 × 2 grid.

- Each tile is the top 1,300 px of the page: the header, the product's
  identity, the gallery and the purchase surface, and the start of the
  information below.
- The full pages are the files above.
- The sheet shows that all four put the photograph and buying together on
  the first screen, that each looks different, and that each belongs to its
  own Home, Browse, Auction Detail and Live Auction pages.

## Interaction evidence

`product-detail-interaction-evidence.jpg` shows Option 4 (Contemporary
Saudi Commerce) in English. It was captured in real time on the production
build:

1. quantity 3: the total appears (3 × SAR 189 = SAR 567);
2. Add to cart: the cart count (3) and "In your cart: 3", with the toast
   on the other side of the page, clear of the panel;
3. Buy it now: adds 2 more and opens the cart drawer (5);
4. sold out (`tyre-inflator`): no quantity, the disabled button, "See
   similar items";
5. the full lot (`kitchen-pallet`): quantity locked at 1 and explained;
6. the grade guide, this item's grade marked;
7. the phone: the purchase bar, with the toast above it.

The same steps pass in all four options and both languages (report §H–§O).
