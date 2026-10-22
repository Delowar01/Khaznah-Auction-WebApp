// Sample carts for the Option 3 cart preview states (lib/previewStates.js).
// Each loads into the preview store, so the header count, the cart drawer and
// checkout follow. Chosen to show every documented line rule: three sellers,
// a discounted item, a per-case bulk line, low stock, a packed pallet and a
// "both" lot (both full-stock and locked), and — in "attention" — an item
// that sold out and one above its stock, which block checkout.

export const SAMPLE_CARTS = {
  sample: [
    { slug: "capsule-coffee", qty: 1 },
    { slug: "monitor-stands-5", qty: 2 },
    { slug: "task-lamp", qty: 2 },
    { slug: "fridge-690", qty: 1 },
    { slug: "kitchen-pallet", qty: 1 },
  ],
  attention: [
    { slug: "capsule-coffee", qty: 5 },
    { slug: "tyre-inflator", qty: 1 },
    { slug: "task-lamp", qty: 1 },
  ],
  // A guest's cart (signed out): a small cart from two sellers.
  guest: [
    { slug: "field-watch", qty: 1 },
    { slug: "hairpin-desk", qty: 1 },
  ],
};
