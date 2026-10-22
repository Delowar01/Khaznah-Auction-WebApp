// The approved pages keep their auction-first navigation, and the shopping
// path now reaches the new pages: product → cart drawer → cart and
// checkout. The seller storefront (Phase 1): production's hero fields only,
// scoped listings with Browse's controls, the error state and the 404.
const MODES = {
  en: ["Discover", "Timed Auctions", "Live Auction", "Buy Now", "Sellers", "Bulk & Pallets"],
  ar: null,
};

const SELLER = {
  en: { chip: "Seller · REDSEA", headline: "Verified stock, straight from the seller.", error: "We couldn’t load this seller catalogue", all: "Browse all listings", live: "Join live" },
  ar: { chip: "البائع · REDSEA", headline: "بضاعة موثّقة، مباشرة من البائع.", error: "تعذر تحميل متجر البائع", all: "تصفح جميع المنتجات", live: "انضم للمباشر" },
};

// Words for things the seller lookup does not provide.
const INVENTED = /\b(rating|ratings|review|reviews|follower|followers|verified seller|top seller)\b/i;

export default async function discovery(h) {
  // Auction-first shopping modes in the header, on every approved page.
  for (const route of ["", "/browse", "/auction", "/live-auction", "/product"]) {
    const { page, close } = await h.open("en", route);
    const labels = await page.locator("header nav li").allInnerTexts();
    h.check(`header modes auction-first on ${route || "/"}`, labels.map((text) => text.trim()).join("|") === MODES.en.join("|"), labels.join("|"));
    await close();
  }

  // Product → cart drawer → View cart / Checkout.
  {
    const { page, errors, close } = await h.open("en", "/product");
    await page.getByTestId("add-to-cart").click();
    await page.waitForTimeout(300);
    await page.locator("header").getByRole("button", { name: /^Cart, \d+ items$/ }).click();
    const drawer = page.getByRole("dialog");
    await drawer.waitFor({ state: "visible" });
    const links = await drawer.getByRole("link").evaluateAll((items) => items.map((item) => item.getAttribute("href")));
    h.check("cart drawer links to the cart page", links.some((href) => href?.endsWith("/concept-c/cart")));
    h.check("cart drawer links to checkout", links.some((href) => href?.endsWith("/concept-c/checkout")));
    await drawer.getByRole("link", { name: "View cart" }).click();
    await page.waitForURL(/\/concept-c\/cart$/);
    h.check("View cart opens the cart with the product", (await page.getByTestId("cart-line").count()) === 1);
    h.check("product → cart: no errors", errors.length === 0, errors.slice(0, 2).join(" | "));
    await close();
  }

  // Seller storefront.
  for (const lang of ["en", "ar"]) {
    const c = SELLER[lang];
    {
      const { page, errors, close } = await h.open(lang, "/seller/REDSEA");
      const chip = (await page.getByTestId("seller-chip").innerText()).replace(/\s+/g, " ").trim();
      h.check(`${lang} seller: "Seller · CODE" chip`, chip.toLowerCase() === c.chip.toLowerCase(), chip);
      h.check(`${lang} seller: production headline is the h1`, (await page.locator("h1").innerText()).trim() === c.headline);
      const text = await h.mainText(page);
      h.check(`${lang} seller: no invented seller fields`, !INVENTED.test(text), text.match(INVENTED)?.[0] || "");
      h.check(`${lang} seller: listings with Browse's results`, (await page.locator("main article, main [data-testid='product-card']").count()) > 0);
      h.check(`${lang} seller: the live seller offers Join live`, (await page.getByRole("link", { name: c.live }).count()) === 1);
      await h.audit(page, `${lang} seller REDSEA`, { errors });
      await close();
    }
    {
      const { page, errors, close } = await h.open(lang, "/seller/RAWABI");
      h.check(`${lang} seller without a live sale: production's "no live auctions" line`, (await h.mainText(page)).length > 0 && (await page.getByRole("link", { name: c.live }).count()) === 0);
      await h.audit(page, `${lang} seller RAWABI`, { errors, axe: false });
      await close();
    }
    {
      const { page, errors, close } = await h.open(lang, "/seller/REDSEA?state=error");
      const alert = page.locator('main [role="alert"]');
      h.check(`${lang} seller error: production's message`, (await alert.innerText()).includes(c.error));
      const href = await page.getByRole("link", { name: c.all }).getAttribute("href");
      h.check(`${lang} seller error: Browse all listings`, /\/concept-c\/browse$/.test(href || ""), href);
      await h.audit(page, `${lang} seller error`, { errors });
      await close();
    }
  }
  {
    const { status, close } = await h.open("en", "/seller/NOPE");
    h.check("unknown seller code: 404", status === 404, `${status}`);
    await close();
  }
  for (const width of [390, 320]) {
    const { page, errors, close } = await h.open("ar", "/seller/REDSEA", { width });
    await h.audit(page, `seller phone ${width}`, { errors, axe: width === 390 });
    await close();
  }
}
