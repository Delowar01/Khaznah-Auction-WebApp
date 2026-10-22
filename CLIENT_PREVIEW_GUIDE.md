# Khazna — Customer Website Design Preview: Review Guide

## Purpose

**Option 3 — Visual Discovery Marketplace is the selected master design.**
The preview now shows the complete customer website in Option 3: every page
a customer meets, from the home page to checkout, payment, the buyer
account, signing in and the help pages, in English and Arabic, on desktop
and on phones.

The design is **approved and frozen** at commit
`892dd183b4481f1f3fef021d7f84ba69fbf9e7cd`. What follows is production
integration, not further design.

Options 1, 2 and 4 stay in the preview exactly as they were reviewed (the
five pages each), for reference only. They were not developed further.

## What to review

In Option 3, please review the pages in the order of the dark bar's page
picker:

1. **Approved review pages** (already approved; unchanged): Home, Browse,
   Auction, Live auction, Product.
2. **Shopping:** Seller storefront, Cart, Checkout, Card payment, Payment
   result.
3. **Account:** My account, with its nine tabs — Overview, Watchlist, Won,
   Orders, Wallet, Payments, Disputes, Notifications and Profile.
4. **Sign in and sign up:** Sign in, Create account, Seller registration.
5. **Company and help:** About, How it works, FAQ, Contact, Privacy policy,
   Terms and conditions.
6. **States and system:** Components & states (the shared building blocks
   and the standard empty, error and loading states — a review page that
   exists only in the preview) and Page not found (404).

As you go through them, please consider:

- **One website** — do the new pages feel like the approved five pages?
- **The buying path** — from a product or a won auction to the cart,
  checkout and payment, and back to the account.
- **The account** — finding orders, payments, the wallet, disputes and
  notifications.
- **Mobile** — the same pages on a phone.
- **Arabic** — the same pages in Arabic, right to left.

## Preview addresses are not the live website's addresses

The preview's addresses are for design review only:

- Every preview page lives under `/en/concept-c/…` or `/ar/concept-c/…`.
  The live website does **not** put the language in its addresses; it keeps
  remembering each customer's language choice as it does today, and Arabic
  pages switch to right to left in the same way. No change to the live
  website's addresses is approved.
- A Buy Now item is at `/shop/{number}` on the live website. The preview
  shows it at `…/concept-c/product`, an address that exists only in the
  preview.
- A live auction is at `/live/{event}` on the live website. The preview
  shows one sample event at `…/concept-c/live-auction`, an address that
  exists only in the preview. `/live` on its own opens the Live tab of
  Browse, on both.
- A seller's storefront is at `/seller/{CODE}` on both. The live website
  has **no** sellers page at `/seller`: in the preview, the header's
  "Sellers" link opens a stand-in (one seller's storefront) that exists only
  in the preview.
- Order-detail addresses such as `/account/orders/{number}` or
  `/orders/{number}` do not exist on the live website; in the preview they
  show the Page not found screen.

The full list of live-website addresses and how each Option 3 page maps
onto them is in OPTION3_COMPLETE_CUSTOMER_WEBSITE_REPORT.md ("Option 3 →
production route integration map").

## Page states

Many pages have more than one state: an empty cart, a loading page, a
failed payment, a signed-out visitor, a step of a form. On Option 3 pages
the dark bar has a **Preview state** picker that lists the states of the
page you are on. Choose one to see the page in that state; choose the
first entry to return to the normal page.

## Signing in and out

The preview signs you in as the demo buyer. Use **Logout** in the account
menu (the person icon in the header, or the phone menu) to see the website
as a visitor: the account and checkout then ask you to sign in, as the
live platform does. Sign in again on the **Sign in** page with any email
and password. The choice lasts while the browser tab stays open.

## Using the preview

- **Start page:** the preview opens on a page showing the four options side
  by side. Select **Explore** on Option 3, or go straight to one of its
  pages.
- **The dark bar at the top** belongs to the presentation, not to the
  website. Use it to:
  - move between pages (the page picker) and, on Option 3, between the
    states of a page (the **Preview state** picker);
  - switch to another option;
  - change the language (**EN / العربية**);
  - open a tablet or mobile frame;
  - return to the start page (**Concepts**).
- **Switching options** loads the page afresh. Anything added to the demo
  cart or watchlist starts again in each option.
- **To see a design on its own**, hide the bar with its hide button or the
  full-stop key (**.**). Bring it back with the small tab at the side of
  the screen.
- **On a phone**, simply open the preview link. Each page adapts to the
  screen.

## Important

**These are interactive design prototypes using sample data. Approving a
page approves its visual and UX design; it does not automatically approve
new functionality represented only for demonstration.**

- Product information, sellers, prices, orders, balances, figures, auction
  activity and interactive behaviour are samples and may not match the
  live platform.
- **No payment is taken.** The card payment page shows where the payment
  provider's secure card form appears; it is not a working card form.
- Nothing you enter (sign-in details, addresses, messages, dispute
  details) is sent anywhere.
- The **Preview state** picker, the simulated sign-in, the `/seller` stand-in
  and the Components & states page belong to the preview only; they are not
  part of the live website.
- The legal pages show the live platform's current text unchanged; the
  design does not change their wording or dates.
- Where the live platform has a known quirk, the preview keeps it rather
  than quietly fixing it. The list, and the questions that need a business
  or legal decision, are in OPTION3_COMPLETE_CUSTOMER_WEBSITE_REPORT.md.
