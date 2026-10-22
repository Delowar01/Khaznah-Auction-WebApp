// Buyer account (/account): the sign-in guard, the nine sections in
// English and Arabic (?tab= and its aliases), the legacy /account/watchlist
// redirect, switching sections in place, the shell states (empty,
// suspended, appeal, loading, error) and the main actions of every section:
// quick bid and the auction panel, Pay now (delivery pricing, coupon),
// order details, tracking, load more, invoice PDF, group payment, wallet
// top-up rules and saved cards, disputes (form rules, submit, cancel),
// notifications (filters, load more, mark read) and the profile (address
// rules, delete, email code, password), with focus returning after each
// panel. Phone widths: the section row replaces the side list.
const TABS = ["overview", "watchlist", "won", "orders", "wallet", "payments", "disputes", "notifications", "profile"];
const TITLES = {
  en: { overview: "Overview", watchlist: "Watchlist", won: "Won Items", orders: "Orders & Invoices", wallet: "Wallets & Deposits", payments: "Payment Methods", disputes: "Disputes", notifications: "Notifications", profile: "Profile" },
  ar: { overview: "نظرة عامة", watchlist: "المفضلة", won: "المزادات الفائزة", orders: "الطلبات والفواتير", wallet: "المحفظة والتأمينات", payments: "طرق الدفع", disputes: "النزاعات", notifications: "الإشعارات", profile: "الملف الشخصي" },
};
const COPY = {
  en: { hub: "Buyer Account Hub", suspended: "Your account has been suspended", noWins: "No won auction items yet." },
  ar: { hub: "مركز حساب المشتري", suspended: "تم تعليق حسابك", noWins: "لا توجد مزادات فائزة بعد." },
};

const title = (page) => page.getByTestId("tab-title").innerText();
const activeId = (page) => page.evaluate(() => document.querySelector('[data-testid^="tab-"][aria-current="page"]')?.dataset.testid);
const focused = (page) => page.evaluate(() => document.activeElement?.dataset?.testid || document.activeElement?.textContent?.trim().slice(0, 40));

export default async function account(h) {
  // Sign-in guard: off to sign in, keeping the section to come back to.
  {
    const { page, close } = await h.open("en", "/account?tab=orders", { signedOut: true, wait: 300 });
    await page.waitForURL(/\/login\?next=/, { timeout: 30000 }).catch(() => {});
    h.check("guard: a signed-out visitor goes to sign in with next", /\/concept-c\/login\?next=%2Faccount%3Ftab%3Dorders$/.test(page.url()), page.url());
    await close();
  }

  // Every section in both languages, chosen by ?tab=.
  for (const lang of ["en", "ar"]) {
    for (const tab of TABS) {
      const { page, errors, close } = await h.open(lang, `/account?tab=${tab}`);
      h.check(`${lang} ${tab}: section title`, (await title(page)) === TITLES[lang][tab], await title(page));
      h.check(`${lang} ${tab}: marked current in the side list`, (await activeId(page)) === `tab-${tab}`);
      if (tab === "overview") h.check(`${lang}: hub heading`, (await page.locator("h1").innerText()).replace(/\s+/g, " ").trim() === COPY[lang].hub, await page.locator("h1").innerText());
      await h.audit(page, `${lang} account ${tab}`, { errors });
      await close();
    }
  }

  // Production's aliases and fallback.
  for (const [query, tab] of [
    ["deposits", "wallet"],
    ["bids", "watchlist"],
    ["Orders", "overview"],
    ["nothing", "overview"],
  ]) {
    const { page, close } = await h.open("en", `/account?tab=${query}`);
    h.check(`?tab=${query} opens ${tab}`, (await title(page)) === TITLES.en[tab]);
    await close();
  }

  // Legacy /account/watchlist.
  {
    const { page, close } = await h.open("en", "/account/watchlist", { wait: 300 });
    await page.waitForURL(/\/account\?tab=watchlist$/, { timeout: 30000 }).catch(() => {});
    await page.getByTestId("tab-title").waitFor({ timeout: 30000 }).catch(() => {});
    h.check("/account/watchlist opens the Watchlist section", /\/concept-c\/account\?tab=watchlist$/.test(page.url()) && (await title(page)) === "Watchlist", page.url());
    await close();
  }

  // Switching sections replaces the address in place and keeps other parameters.
  {
    const { page, close } = await h.open("en", "/account?tab=orders&order=5");
    const before = await page.evaluate(() => history.length);
    await page.getByTestId("tab-wallet").first().click();
    await page.waitForTimeout(300);
    h.check("switching keeps ?order= and adds no history entry", /tab=wallet&order=5$/.test(page.url()) && (await page.evaluate(() => history.length)) === before, page.url());
    h.check("switching shows the new section", (await title(page)) === TITLES.en.wallet);
    // Figures come from what this visit loaded: Orders loaded the orders.
    await page.getByTestId("tab-overview").first().click();
    await page.waitForTimeout(300);
    h.check("overview figures after Orders", (await page.getByTestId("stat-orders").innerText()).includes("8"));
    await close();
  }
  {
    const { page, close } = await h.open("en", "/account?tab=profile");
    h.check("a direct visit to Profile shows 0 orders (only loaded data counts)", (await page.getByTestId("stat-orders").innerText()).includes("0"));
    await close();
  }

  // Shell states.
  for (const lang of ["en", "ar"]) {
    const { page, errors, close } = await h.open(lang, "/account?state=empty&tab=won");
    h.check(`${lang} empty: no wins message`, (await h.mainText(page)).includes(COPY[lang].noWins));
    await h.audit(page, `${lang} account empty won`, { errors });
    await close();
  }
  {
    const { page, close } = await h.open("en", "/account?state=empty");
    h.check("empty: no pending alert, zero figures", (await page.getByTestId("mini-pending").innerText()).startsWith("0") && !(await h.mainText(page)).includes("Payment action required"));
    await close();
  }
  for (const lang of ["en", "ar"]) {
    const { page, errors, close } = await h.open(lang, "/account?state=suspended");
    h.check(`${lang} suspended: banner`, (await page.getByTestId("suspension-banner").innerText()).includes(COPY[lang].suspended));
    const submit = page.getByTestId("appeal-form").locator('button[type="submit"]');
    h.check(`${lang} suspended: appeal needs text`, await submit.isDisabled());
    await h.audit(page, `${lang} account suspended`, { errors });
    if (lang === "en") {
      await page.getByTestId("appeal-form").locator("textarea").fill("I paid late because I was travelling.");
      await submit.click();
      await page.getByTestId("appeal-latest").waitFor({ timeout: 10000 }).catch(() => {});
      h.check("suspended: a sent appeal shows its status and no new form", (await page.getByTestId("appeal-latest").count()) === 1 && (await page.getByTestId("appeal-form").count()) === 0);
    }
    await close();
  }
  {
    const { page, close } = await h.open("en", "/account?state=appeal");
    h.check("appeal: latest appeal shown", (await page.getByTestId("appeal-latest").innerText()).includes("Pending"));
    await close();
  }
  {
    const { page, errors, close } = await h.open("en", "/account?state=loading&tab=orders");
    h.check("loading: skeleton announced", (await page.getByTestId("account-loading").getAttribute("role")) === "status");
    await h.audit(page, "account loading", { errors });
    await close();
  }
  {
    const { page, errors, close } = await h.open("en", "/account?state=error&tab=wallet");
    h.check("error: wallet refresh failure with retry", (await h.mainText(page)).includes("Wallet information could not be refreshed.") && (await page.getByTestId("load-error").count()) === 1);
    await h.audit(page, "account error wallet", { errors });
    await close();
  }
  {
    const { page, close } = await h.open("en", "/account?state=error&tab=notifications");
    h.check("error: notifications banner", (await h.mainText(page)).includes("Notifications could not be loaded."));
    await close();
  }

  // Watchlist: quick bid and the auction activity panel.
  {
    const { page, errors, close } = await h.open("en", "/account?tab=watchlist");
    const row = page.locator('[data-testid="watch-row"][data-slug="tv-43"]');
    h.check("watchlist: outbid lot", (await row.innerText()).includes("Outbid"));
    await row.getByTestId("quick-bid").locator("button").click();
    await page.waitForTimeout(900);
    h.check("watchlist: an empty quick bid bids the minimum and leads", (await row.innerText()).includes("Winning") && (await row.innerText()).includes("1,265"), (await row.innerText()).slice(0, 120));
    const view = page.locator('[data-testid="watch-row"][data-slug="seat-covers"]').getByTestId("view-lot");
    await view.click();
    const drawer = page.getByTestId("auction-drawer");
    await drawer.waitFor({ state: "visible" });
    await page.waitForTimeout(700);
    h.check("auction panel: bid log", (await drawer.innerText()).includes("Bid log"));
    await h.audit(page, "account auction panel", { errors });
    await page.keyboard.press("Escape");
    await drawer.waitFor({ state: "hidden" });
    await page.waitForTimeout(150);
    h.check("auction panel: focus returns to View lot", (await focused(page)) === "view-lot");
    await close();
  }

  // Won: Pay now — delivery priced before Pay, coupons.
  {
    const { page, errors, close } = await h.open("en", "/account?tab=won");
    h.check("won: four wins", (await page.getByTestId("won-row").count()) === 4);
    await page.locator('[data-testid="won-row"][data-order="5114"]').getByTestId("pay-now").click();
    const panel = page.getByTestId("pay-now-panel");
    await panel.waitFor({ state: "visible" });
    const pay = page.getByTestId("pay-submit");
    h.check("pay now: Pay waits for the delivery price", await pay.isDisabled());
    await page.waitForFunction(() => !document.querySelector('[data-testid="pay-submit"]')?.disabled, null, { timeout: 8000 }).catch(() => {});
    h.check("pay now: priced, then Pay is enabled", !(await pay.isDisabled()) && (await panel.innerText()).includes("Delivery"));
    await panel.getByRole("button", { name: /WELCOME10/ }).click();
    await page.waitForTimeout(800);
    h.check("pay now: coupon applied line", (await panel.innerText()).includes("Coupon applied (WELCOME10)"));
    await panel.getByRole("textbox", { name: "Coupon code" }).fill("NOPE");
    await panel.getByRole("button", { name: "Apply", exact: true }).click();
    await page.waitForTimeout(800);
    h.check("pay now: unknown code refused with the server's message", (await panel.innerText()).includes("This code doesn't apply to your order"));
    await h.audit(page, "account pay now", { errors });
    await page.keyboard.press("Escape");
    await panel.waitFor({ state: "hidden" });
    h.check("pay now: closing refreshes the section (production)", await page.getByTestId("account-loading").isVisible().catch(() => false));
    await close();
  }

  // Orders: group payment, details, tracking, load more, invoice PDF, pay without address.
  {
    const { page, errors, close } = await h.open("en", "/account?tab=orders");
    h.check("orders: eight cards", (await page.getByTestId("order-card").count()) === 8);
    h.check("orders: multi-seller banner", (await page.getByTestId("pay-group").innerText()).includes("for all 2 orders"));
    const card = page.locator('[data-testid="order-card"][data-order="5102"]');
    await card.getByTestId("order-details").click();
    const drawer = page.getByTestId("order-drawer");
    await drawer.waitFor({ state: "visible" });
    await page.waitForTimeout(700);
    const text = await drawer.innerText();
    h.check("order details: totals, VAT and coupon", text.includes("VAT (included)") && text.includes("Coupon applied (WELCOME10)") && text.includes("Order total"));
    await h.audit(page, "account order details", { errors });
    await page.keyboard.press("Escape");
    await drawer.waitFor({ state: "hidden" });
    await page.waitForTimeout(150);
    h.check("order details: focus returns to Details", (await focused(page)) === "order-details");

    await page.locator('[data-testid="order-card"][data-order="5096"]').getByTestId("order-track").click();
    await drawer.waitFor({ state: "visible" });
    await page.waitForTimeout(800);
    h.check("track: tracking number shown", (await drawer.innerText()).includes("SMS7731942"));
    await page.keyboard.press("Escape");
    await drawer.waitFor({ state: "hidden" });
    h.check("track: delivery support follows the tracked order", (await page.getByTestId("delivery-support").innerText()).includes("KZ-ORD-5096"));

    const [download] = await Promise.all([page.waitForEvent("download", { timeout: 10000 }).catch(() => null), card.getByTestId("order-invoice").click()]);
    h.check("invoice: a PDF named after the invoice", download?.suggestedFilename() === "INV-2026-0412.pdf", download?.suggestedFilename());
    await page.getByTestId("action-message").waitFor({ timeout: 5000 }).catch(() => {});
    h.check("invoice: page message", (await page.getByTestId("action-message").innerText().catch(() => "")).includes("Invoice PDF generated and downloaded."));

    await page.locator('[data-testid="order-card"][data-order="5114"]').getByTestId("order-pay").click();
    await page.waitForTimeout(1000);
    h.check("pay from Orders without an address: the server's refusal (quirk Q8)", (await page.getByTestId("action-message").innerText()).includes("Select a delivery address before paying."));

    await page.getByTestId("orders-more").click();
    await page.waitForTimeout(900);
    h.check("orders: load 8 more adds page 2 and hides the button", (await page.getByTestId("order-card").count()) === 11 && (await page.getByTestId("orders-more").count()) === 0);
    await close();
  }

  // Wallet: top-up rules, quick amounts, saved cards.
  {
    const { page, errors, close } = await h.open("en", "/account?tab=wallet");
    await page.getByRole("button", { name: /100/ }).first().click();
    h.check("wallet: quick amount fills the field", (await page.getByTestId("topup-amount").inputValue()) === "100");
    await page.getByTestId("topup-amount").fill("5");
    await page.getByTestId("topup").click();
    await page.getByTestId("wallet-banner").waitFor({ timeout: 5000 }).catch(() => {});
    h.check("wallet: the server's minimum message", (await page.getByTestId("wallet-banner").innerText()).includes("Minimum wallet top-up amount"));
    await page.getByTestId("remove-method").first().click();
    await page.waitForTimeout(700);
    h.check("wallet: card removed without confirmation (production)", (await page.getByTestId("saved-method").count()) === 1 && (await page.getByTestId("wallet-banner").innerText()).includes("Saved payment method removed."));
    await h.audit(page, "account wallet after actions", { errors });
    await close();
  }

  // Disputes: a direct visit has no orders; after Overview the form works.
  {
    const { page, close } = await h.open("en", "/account?tab=disputes");
    await page.getByTestId("new-dispute").click();
    await page.getByTestId("dispute-modal").waitFor({ state: "visible" });
    h.check("dispute: direct visit has no orders to choose (production)", (await page.getByTestId("dispute-no-orders").count()) === 1 && (await page.getByTestId("submit-dispute").isDisabled()));
    await page.keyboard.press("Escape");
    await close();
  }
  {
    const { page, errors, close } = await h.open("en", "/account");
    await page.getByTestId("tab-disputes").first().click();
    await page.waitForTimeout(300);
    h.check("disputes: list with an open case", (await page.getByTestId("cancel-dispute").count()) >= 1);
    await page.getByTestId("alert-open-dispute").click();
    const modal = page.getByTestId("dispute-modal");
    await modal.waitFor({ state: "visible" });
    const submit = page.getByTestId("submit-dispute");
    await page.getByTestId("dispute-reason").fill("Too short");
    h.check("dispute: under 10 characters keeps Submit off", (await submit.isDisabled()) && (await page.getByTestId("dispute-hint").innerText()).includes("more character"));
    await h.audit(page, "account dispute form", { errors });
    await page.getByTestId("dispute-reason").fill("The lamp shade arrived dented on one side.");
    h.check("dispute: 10+ characters enables Submit", !(await submit.isDisabled()));
    await submit.click();
    await modal.waitFor({ state: "hidden", timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(300);
    h.check("dispute: submitted, listed as open, page message", (await h.mainText(page)).includes("Dispute submitted.") && (await page.getByTestId("cancel-dispute").count()) >= 2);
    await page.locator('[data-testid="cancel-dispute"]:visible').first().click();
    await page.getByTestId("cancel-dispute-dialog").waitFor({ state: "visible" });
    await page.getByTestId("confirm-cancel-dispute").click();
    await page.waitForTimeout(900);
    h.check("dispute: cancelled after confirmation", (await h.mainText(page)).includes("Dispute cancelled."));
    await close();
  }

  // Notifications: filters, load more under All only, mark read.
  {
    const { page, errors, close } = await h.open("en", "/account?tab=notifications");
    h.check("notifications: page 1 has 10", (await page.getByTestId("notification").count()) === 10);
    await page.getByTestId("filter-bidding").click();
    h.check("notifications: Bids filter", (await page.getByTestId("notification").count()) === 3 && (await page.getByTestId("notifications-more").count()) === 0);
    await page.getByTestId("filter-all").click();
    await page.getByTestId("notifications-more").click();
    await page.waitForTimeout(900);
    h.check("notifications: load 10 more", (await page.getByTestId("notification").count()) === 14);
    await page.getByTestId("mark-read").first().click();
    await page.waitForTimeout(500);
    h.check("notifications: mark read lowers the count", (await h.mainText(page)).includes("3 unread"));
    await page.getByTestId("mark-all-read").click();
    await page.waitForTimeout(600);
    h.check("notifications: all read", (await h.mainText(page)).includes("Up to date") && (await page.getByTestId("badge-notifications").count()) === 0);
    await h.audit(page, "account notifications after actions", { errors });
    await close();
  }

  // Profile: address rules, delete, email code, password.
  {
    const { page, errors, close } = await h.open("en", "/account?tab=profile");
    const form = page.getByTestId("address-form");
    await form.getByLabel("Recipient name").fill("Faisal Al-Harbi");
    await form.getByLabel("City").fill("Dammam");
    await page.getByTestId("submit-address").click();
    await page.waitForTimeout(800);
    h.check("address: a blank label is refused by the server rule", (await page.getByTestId("action-message").innerText()).includes("Label: This field may not be blank."));
    await form.getByLabel("Label").fill("Warehouse");
    await form.getByLabel("City").fill("Dammam");
    await page.getByTestId("submit-address").click();
    await page.waitForTimeout(800);
    h.check("address: saved and listed", (await page.getByTestId("address-card").count()) === 3);
    await page.getByTestId("delete-address").first().click();
    await page.getByTestId("delete-address-dialog").waitFor({ state: "visible" });
    await page.getByTestId("confirm-delete-address").click();
    await page.waitForTimeout(700);
    h.check("address: deleted after confirmation", (await page.getByTestId("address-card").count()) === 2);
    await page.getByTestId("verify-email").click();
    await page.getByTestId("otp-panel").waitFor();
    await page.waitForTimeout(900);
    await page.getByTestId("otp-panel").locator("input").fill("123456");
    await page.getByTestId("verify-code").click();
    await page.waitForTimeout(1000);
    h.check("email: a six-digit code verifies", (await page.getByTestId("otp-panel").count()) === 0 && (await h.mainText(page)).includes("Verified"));
    await page.getByLabel("Current password").fill("old-password");
    await page.getByLabel("New password", { exact: true }).fill("new-password-1");
    await page.getByLabel("Confirm new password").fill("new-password-2");
    await page.getByTestId("change-password").click();
    await page.waitForTimeout(900);
    h.check("password: mismatch message", (await h.mainText(page)).includes("Passwords do not match."));
    await h.audit(page, "account profile after actions", { errors });
    await close();
  }

  // Phones: the section row replaces the side list; no sideways scroll.
  for (const [lang, width, tab] of [
    ["en", 390, "overview"],
    ["ar", 390, "orders"],
    ["en", 320, "wallet"],
    ["ar", 320, "notifications"],
    ["en", 375, "profile"],
    ["ar", 430, "watchlist"],
    ["en", 768, "won"],
  ]) {
    const { page, errors, close } = await h.open(lang, `/account?tab=${tab}`, { width });
    h.check(`${lang} ${width} ${tab}: section row`, await page.locator(`nav [data-testid="tab-${tab}"]`).last().isVisible());
    await h.audit(page, `${lang} account ${tab} ${width}`, { errors, axe: width === 390 });
    await close();
  }
}
