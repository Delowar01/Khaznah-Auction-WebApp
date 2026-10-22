// Every Option 3 route, English and Arabic: the expected status, html lang
// and dir, one h1, one main landmark, a skip link to it (the first Tab stop;
// Enter moves focus to the content), no broken images, no sideways scroll
// at every review width (1920–320 px), no console or page errors, and no
// serious or critical axe findings (at 1440 and 390 px). Also: the
// presentation bar lists every page, and the header's account menu follows
// the simulated session.
import { LANGS, REVIEW_WIDTHS, settle } from "./harness.mjs";

export const ROUTES = [
  ["home", ""],
  ["browse", "/browse"],
  ["auction", "/auction"],
  ["live", "/live-auction"],
  ["product", "/product"],
  ["seller", "/seller/REDSEA"],
  ["sellers", "/seller"],
  ["cart", "/cart"],
  ["checkout", "/checkout"],
  ["payment", "/payment/moyasar/9051"],
  ["paymentResult", "/payment/result?payment_record_id=9051"],
  ["account", "/account"],
  ["login", "/login"],
  ["register", "/register"],
  ["sellerRegister", "/seller/register"],
  ["about", "/about"],
  ["howItWorks", "/how-it-works"],
  ["faq", "/faq"],
  ["contact", "/contact"],
  ["privacy", "/privacy"],
  ["terms", "/terms"],
  ["system", "/system"],
  ["notFound", "/orders/1", 404],
];

const AXE_WIDTHS = [1440, 390];

export default async function global(h) {
  const widths = h
    .opt("widths", REVIEW_WIDTHS.join(","))
    .split(",")
    .map(Number)
    .filter(Boolean);

  for (const lang of LANGS) {
    for (const width of widths) {
      const context = await h.browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
      await context.addInitScript(() => {
        try {
          localStorage.setItem("kz-pbar", "hidden");
        } catch {}
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      for (const [key, route, expected = 200] of ROUTES) {
        errors.length = 0;
        const label = `${key} ${lang} ${width}`;
        let status = 0;
        try {
          const response = await page.goto(h.url(lang, route), { waitUntil: "load", timeout: 90000 });
          status = response?.status() ?? 0;
          await settle(page);
        } catch (error) {
          errors.push(`navigation: ${error.message}`);
        }
        await page.waitForTimeout(250);
        h.check(`${label}: status ${expected}`, status === expected, `${status}`);
        const info = await page.evaluate(() => ({
          skip: Boolean(document.querySelector('a[href="#main"]')) && Boolean(document.querySelector("main#main")),
          broken: [...document.images].filter((img) => img.complete && img.naturalWidth === 0 && img.currentSrc).map((img) => img.currentSrc.split("/").pop()),
        }));
        h.check(`${label}: skip link to main`, info.skip);
        h.check(`${label}: no broken images`, info.broken.length === 0, info.broken.slice(0, 3).join(", "));
        if (width === 1440) {
          // Keyboard: the website's first Tab stop (after the preview's own
          // presentation-bar controls, which come first) is the skip link,
          // and it moves focus to the page's content.
          await page.evaluate(() => document.activeElement?.blur());
          let first = null;
          for (let i = 0; i < 25; i += 1) {
            await page.keyboard.press("Tab");
            const stop = await page.evaluate(() => {
              const el = document.activeElement;
              return el && !el.closest(".kz-pbar, .kz-pbar-show") ? { href: el.getAttribute("href") } : null;
            });
            if (stop) {
              first = stop.href;
              break;
            }
          }
          await page.keyboard.press("Enter");
          await page.waitForTimeout(150);
          const focused = await page.evaluate(() => document.activeElement?.id || document.activeElement?.closest("main")?.id || "");
          h.check(`${label}: keyboard — Tab reaches the skip link, Enter moves to main`, first === "#main" && focused === "main", `${first} → ${focused}`);
        }
        // On the 404 page the browser logs the page's own 404 (and the 404s
        // of links to the same unknown address, e.g. the language switch).
        const logged = expected === 404 ? errors.filter((text) => !/status of 404 \(Not Found\)/.test(text)) : [...errors];
        await h.audit(page, label, { errors: logged, axe: AXE_WIDTHS.includes(width) });
      }
      await context.close();
    }
  }

  // The presentation bar's page picker lists every Option 3 page.
  {
    const context = await h.browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(h.url("en", "/cart"), { waitUntil: "load" });
    await settle(page);
    const values = await page.locator('[data-testid="preview-page"] option').evaluateAll((options) => options.map((option) => option.value));
    const missing = ROUTES.filter(([key]) => key !== "sellers" && !values.includes(key));
    h.check("presentation bar lists every page", missing.length === 0, missing.map(([key]) => key).join(", "));
    const states = await page.locator('[data-testid="preview-state"] option').count();
    h.check("presentation bar offers the cart's preview states", states >= 5, `${states}`);
    await context.close();
  }

  // The header account menu follows the simulated session.
  for (const lang of LANGS) {
    const names =
      lang === "en"
        ? { account: "My Account", logout: "Logout", signIn: "Sign in", create: "Create Account", seller: "Join as Seller", out: "Logged out successfully" }
        : { account: "حسابي", logout: "تسجيل خروج", signIn: "تسجيل الدخول", create: "إنشاء حساب", seller: "انضم كبائع", out: "تم تسجيل الخروج بنجاح" };
    const { page, errors, close } = await h.open(lang, "");
    const trigger = page.locator("header button[aria-expanded]").nth(1);
    await trigger.click();
    h.check(`${lang} account menu: signed-in links`, (await page.getByRole("link", { name: names.account, exact: true }).count()) === 1);
    const hrefs = await page.locator("header").getByRole("link").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    h.check(`${lang} account menu: Orders, Profile and Watchlist tabs`, ["tab=orders", "tab=profile", "tab=watchlist"].every((tab) => hrefs.some((href) => href?.includes(tab))));
    await page.getByRole("button", { name: names.logout }).click();
    h.check(`${lang} account menu: logout toast`, await page.getByText(names.out).first().isVisible());
    await trigger.click();
    const signedOut = await page.locator("header").getByRole("link").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    h.check(
      `${lang} account menu: signed out offers Sign in, Create Account, Join as Seller`,
      ["/login", "/register", "/seller/register"].every((path) => signedOut.some((href) => href?.endsWith(path))),
    );
    await page.reload({ waitUntil: "load" });
    await settle(page);
    await page.locator("header button[aria-expanded]").nth(1).click();
    h.check(`${lang} account menu: signed out survives a reload`, (await page.getByRole("link", { name: names.signIn }).count()) > 0);
    h.check(`${lang} account menu: no errors`, errors.length === 0, errors.slice(0, 2).join(" | "));
    await close();
  }
}
