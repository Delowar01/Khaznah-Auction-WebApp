// Checkout (/checkout): production's screens and rules in the preview —
// Pay disabled until the delivery quote and the pricing preview are current,
// one order per seller, pickup only for Khazna's own lots, the address
// dialog, coupons, the wallet modes, cash on delivery, the processing
// overlay and the way on to the payment page, cancel (empties the cart), and
// every preview state: pickup, no address, pricing, quote error, a reserved
// payment and its probe failure, submitting, redirecting, total changed,
// error, the placeholder "Order Created" screen, signed out, empty, loading.
const COPY = {
  en: {
    pay: /^Pay .* securely$/,
    walletPay: /from wallet$/,
    walletPlus: /^Use wallet \+ pay/,
    walletOnly: "Wallet only",
    walletPlusOption: "Wallet + Moyasar",
    noAddress: "Select a delivery address in Delivery before paying.",
    addFirst: "Add a delivery address to continue.",
    required: "Recipient name, phone, city and street are required for home delivery.",
    saved: "Delivery address saved",
    pickupFrom: "Pickup from Selected warehouse",
    free: "Free",
    checking: "Checking delivery fee...",
    complete: "Complete your payment",
    redirecting: "Opening the secure payment page…",
    refreshed: "Your order total was refreshed. Review it, then pay securely.",
    errorTitle: "Checkout could not continue",
    created: "Order Created",
    createdEyebrow: "BACKEND ORDER CREATED",
    signIn: "Sign in to check out",
    empty: "No items to checkout",
    couponRemoved: "That coupon does not apply to this order and was removed.",
    freeApplied: "Free delivery applied",
    codFee: "Cash on Delivery fee",
    payOnDelivery: "Pay on delivery",
    processing: "Processing Payment",
    sellers: "From 2 sellers — one order & delivery fee each",
  },
  ar: {
    pay: /^ادفع .* بأمان$/,
    walletPay: /من المحفظة$/,
    walletPlus: /^استخدم المحفظة وادفع/,
    walletOnly: "المحفظة فقط",
    walletPlusOption: "المحفظة + ميسر",
    noAddress: "اختر عنواناً في قسم التوصيل قبل الدفع.",
    addFirst: "أضف عنوان توصيل للمتابعة.",
    required: "اسم المستلم والهاتف والمدينة والشارع مطلوبة للتوصيل إلى المنزل.",
    saved: "تم حفظ عنوان التوصيل",
    pickupFrom: "الاستلام من المستودع المحدد",
    free: "مجاني",
    checking: "جارٍ التحقق من رسوم التوصيل...",
    complete: "أكمل عملية الدفع",
    redirecting: "جارٍ فتح صفحة الدفع الآمن…",
    refreshed: "تم تحديث إجمالي طلبك. راجعه ثم ادفع بأمان.",
    errorTitle: "تعذر إكمال الدفع",
    created: "تم إنشاء الطلب",
    createdEyebrow: "تم إنشاء الطلب من الخادم",
    signIn: "سجّل الدخول لإتمام الطلب",
    empty: "لا توجد منتجات للدفع",
    couponRemoved: "هذه القسيمة لا تنطبق على هذا الطلب وتمت إزالتها.",
    freeApplied: "تم تطبيق التوصيل المجاني",
    codFee: "رسوم الدفع عند الاستلام",
    payOnDelivery: "الدفع عند الاستلام",
    processing: "جاري معالجة الدفع",
    sellers: "من 2 بائعين — طلب ورسوم توصيل لكل بائع",
  },
};

const pay = (page) => page.getByTestId("pay-button");
const text = async (locator) => (await locator.innerText()).replace(/[⁦-⁩]/g, "").trim();

/** Waits until Pay is enabled (the quote and the pricing preview have answered). */
async function payEnabled(page, timeout = 8000) {
  try {
    await page.waitForFunction(() => {
      const button = document.querySelector('[data-testid="pay-button"]');
      return button && !button.disabled;
    }, null, { timeout });
    return true;
  } catch {
    return false;
  }
}

export default async function checkout(h) {
  for (const lang of ["en", "ar"]) {
    const c = COPY[lang];

    // The form: two sellers, Pay disabled until the quote and pricing answer.
    {
      // Records whether Pay was ever shown disabled before it became enabled.
      const watchPay = () => {
        window.__payStates = [];
        const timer = window.setInterval(() => {
          const button = document.querySelector('[data-testid="pay-button"]');
          if (!button) return;
          const state = button.disabled ? "disabled" : "enabled";
          if (window.__payStates.at(-1) !== state) window.__payStates.push(state);
          if (state === "enabled") window.clearInterval(timer);
        }, 25);
      };
      const { page, errors, close } = await h.open(lang, "/checkout?state=price-changed", { init: watchPay });
      h.check(`${lang} form: Pay enabled once the quote and pricing are current`, await payEnabled(page));
      const seen = await page.evaluate(() => window.__payStates);
      h.check(`${lang} form: Pay disabled until then`, seen[0] === "disabled" && seen.at(-1) === "enabled", seen.join(" → "));
      h.check(`${lang} form: one order per seller`, (await page.getByTestId("order-card").count()) === 2 && (await h.mainText(page)).includes(c.sellers));
      h.check(`${lang} form: Pay names the amount`, c.pay.test(await text(pay(page))), await text(pay(page)));
      h.check(`${lang} form: pickup unavailable for two sellers`, await page.getByTestId("method-pickup").locator("input").isDisabled());
      h.check(`${lang} total changed: production's message shown`, (await h.mainText(page)).includes(c.refreshed));
      await h.audit(page, `${lang} checkout form`, { errors });
      await close();
    }

    // Wallet modes and the Pay label.
    {
      const { page, close } = await h.open(lang, "/checkout?state=pickup");
      await payEnabled(page);
      await page.getByTestId("wallet-box").getByText(c.walletOnly, { exact: true }).click();
      await page.waitForTimeout(150);
      h.check(`${lang} wallet only: Pay from the wallet`, c.walletPay.test(await text(pay(page))), await text(pay(page)));
      await page.getByTestId("wallet-box").getByText(c.walletPlusOption, { exact: true }).click();
      await page.getByTestId("wallet-amount").fill("100");
      await page.getByTestId("wallet-amount").blur();
      h.check(`${lang} wallet + Moyasar: wallet share then Moyasar`, c.walletPlus.test(await text(pay(page))), await text(pay(page)));
      await page.getByTestId("wallet-max").click();
      h.check(`${lang} wallet: Use maximum fills the total`, Number(await page.getByTestId("wallet-amount").inputValue()) > 100);
      h.check(`${lang} pickup: free, from the platform location`, (await h.mainText(page)).includes(c.pickupFrom) && (await page.getByTestId("pickup-select").inputValue()) !== "");
      await close();
    }

    // Preview states.
    {
      const { page, errors, close } = await h.open(lang, "/checkout?state=no-address");
      await page.waitForTimeout(900);
      const main = await h.mainText(page);
      h.check(`${lang} no address: notice and empty selector`, main.includes(c.noAddress) && main.includes(c.addFirst));
      h.check(`${lang} no address: Pay disabled`, await pay(page).isDisabled());
      await h.audit(page, `${lang} checkout no address`, { errors });
      await close();
    }
    {
      const { page, close } = await h.open(lang, "/checkout?state=quoting");
      await page.waitForTimeout(2500);
      h.check(`${lang} pricing delivery: fee being checked, Pay disabled`, (await h.mainText(page)).includes(c.checking) && (await pay(page).isDisabled()));
      await close();
    }
    {
      const { page, errors, close } = await h.open(lang, "/checkout?state=quote-error");
      await page.waitForTimeout(1600);
      h.check(`${lang} quote error: server message with Retry, Pay disabled`, (await page.getByTestId("quote-error").isVisible()) && (await pay(page).isDisabled()));
      await page.getByTestId("quote-retry").click();
      h.check(`${lang} quote error: Retry prices delivery`, await payEnabled(page));
      await h.audit(page, `${lang} checkout quote error`, { errors, axe: false });
      await close();
    }
    {
      const { page, errors, close } = await h.open(lang, "/checkout?state=session");
      await page.waitForTimeout(900);
      const box = page.getByTestId("pending-payment");
      h.check(`${lang} reserved payment: production's screen`, (await box.isVisible()) && (await box.innerText()).includes(c.complete));
      h.check(`${lang} reserved payment: Resume, Edit and Cancel`, (await page.getByTestId("resume-payment").count()) === 1 && (await page.getByTestId("edit-checkout").count()) === 1 && (await page.getByTestId("pending-cancel").count()) === 1);
      await h.audit(page, `${lang} checkout reserved payment`, { errors });
      await page.getByTestId("edit-checkout").click();
      h.check(`${lang} reserved payment: Edit returns to the form`, await payEnabled(page));
      await close();
    }
    {
      const { page, close } = await h.open(lang, "/checkout?state=session-error");
      await page.waitForTimeout(900);
      h.check(`${lang} payment check failed: error with Retry`, (await page.getByTestId("pending-error").isVisible()) && (await page.getByTestId("pending-retry").count()) === 1);
      await close();
    }
    {
      const { page, close } = await h.open(lang, "/checkout?state=submitting");
      await page.waitForTimeout(900);
      const overlay = page.getByTestId("processing-overlay");
      h.check(`${lang} submitting: processing steps`, (await overlay.isVisible()) && (await overlay.innerText()).includes(c.processing));
      await overlay.getByRole("button").click();
      const hidden = await overlay.waitFor({ state: "hidden", timeout: 4000 }).then(() => true).catch(() => false);
      h.check(`${lang} submitting: Cancel only hides the overlay`, hidden && (await page.getByTestId("orders-panel").isVisible()));
      await close();
    }
    {
      const { page, close } = await h.open(lang, "/checkout?state=redirecting");
      await page.waitForTimeout(900);
      h.check(`${lang} redirecting: opening the payment page`, (await page.getByTestId("redirecting").innerText()).includes(c.redirecting));
      await close();
    }
    {
      const { page, errors, close } = await h.open(lang, "/checkout?state=error");
      await page.waitForTimeout(900);
      const panel = page.getByTestId("checkout-error");
      const href = await panel.getByRole("link").getAttribute("href");
      h.check(`${lang} error: production's panel with Try again and Review cart`, (await panel.innerText()).includes(c.errorTitle) && (await page.getByTestId("checkout-retry").count()) === 1 && /\/concept-c\/cart$/.test(href || ""), href);
      await h.audit(page, `${lang} checkout error`, { errors });
      await close();
    }
    {
      const { page, errors, close } = await h.open(lang, "/checkout?state=created");
      const screen = page.getByTestId("order-created");
      const track = await page.getByTestId("track-order").getAttribute("href");
      h.check(`${lang} created: production's placeholder screen`, (await screen.innerText()).includes(c.created) && (await screen.innerText()).includes(c.createdEyebrow));
      h.check(`${lang} created: Track Order keeps production's /orders/1`, /\/concept-c\/orders\/1$/.test(track || ""), track);
      await h.audit(page, `${lang} checkout created`, { errors });
      await close();
    }
    {
      const { page, errors, close } = await h.open(lang, "/checkout?state=signed-out");
      const href = await page.getByTestId("checkout-signin-link").getAttribute("href");
      h.check(`${lang} signed out: sign in, back to the cart`, (await h.mainText(page)).includes(c.signIn) && /\/login\?next=\/cart$/.test(href || ""), href);
      await h.audit(page, `${lang} checkout signed out`, { errors });
      await close();
    }
    {
      const { page, errors, close } = await h.open(lang, "/checkout?state=empty");
      await page.waitForTimeout(800);
      const hrefs = await page.locator("main a").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
      h.check(`${lang} empty: production's message and links`, (await h.mainText(page)).includes(c.empty) && hrefs.some((href) => /\/browse$/.test(href)) && hrefs.some((href) => /\/account\?tab=orders$/.test(href)));
      await h.audit(page, `${lang} checkout empty`, { errors });
      await close();
    }
    {
      const { page, errors, close } = await h.open(lang, "/checkout?state=loading");
      h.check(`${lang} loading: announced and busy`, (await page.locator('main [aria-busy="true"]').count()) > 0 && (await page.locator('main [role="status"]').count()) > 0);
      await h.audit(page, `${lang} checkout loading`, { errors, axe: false });
      await close();
    }
  }

  // Interactions (English).
  {
    const { page, close } = await h.open("en", "/checkout?state=error");
    await payEnabled(page);
    // Quantity: the quote goes stale, Pay waits for the new one.
    const lamp = page.locator('[data-testid="checkout-line"][data-slug="task-lamp"]');
    await lamp.getByRole("button", { name: /^Increase quantity/ }).click();
    h.check("quantity: + adds one", (await lamp.locator('[aria-live="polite"]').innerText()) === "3");
    h.check("quantity: Pay waits for the new quote", await pay(page).isDisabled());
    h.check("quantity: Pay back once re-quoted", await payEnabled(page));
    // Remove: no confirmation.
    await page.locator('[data-testid="checkout-line"][data-slug="hairpin-desk"]').getByTestId("checkout-remove").click();
    h.check("remove: line removed without confirmation", (await page.getByTestId("checkout-line").count()) === 3);
    // Cash on delivery for the warehouse that offers it.
    await page.getByTestId("order-card").nth(1).getByText("Cash on delivery", { exact: true }).click();
    await page.waitForTimeout(200);
    const summary = await page.getByTestId("summary-card").innerText();
    h.check("COD: fee and pay-on-delivery amount", summary.includes(COPY.en.codFee) && (await page.getByTestId("pay-on-delivery").isVisible()));
    // Coupons: a suggested free-delivery coupon, then an unknown code.
    const coupon = page.getByTestId("order-coupon").first();
    await coupon.getByTestId("coupon-toggle").click();
    await coupon.getByTestId("coupon-option").first().click();
    await page.waitForTimeout(1000);
    h.check("coupon: applied from the list", (await coupon.getByTestId("coupon-status").innerText()).includes(COPY.en.freeApplied));
    await coupon.getByTestId("coupon-toggle").click();
    await coupon.getByTestId("coupon-input").fill("nosuchcode");
    h.check("coupon: code upper-cased as typed", (await coupon.getByTestId("coupon-input").inputValue()) === "NOSUCHCODE");
    await coupon.getByTestId("coupon-apply").click();
    await page.waitForTimeout(1200);
    h.check("coupon: an ineligible code is removed with production's message", await page.getByText(COPY.en.couponRemoved).first().isVisible());
    await close();
  }
  {
    const { page, close } = await h.open("en", "/checkout?state=pickup");
    await payEnabled(page);
    await page.getByTestId("method-home").click();
    await page.getByTestId("address-disclosure").locator("summary").click();
    await page.getByTestId("add-address").click();
    const dialog = page.getByTestId("address-dialog");
    await dialog.waitFor({ state: "visible" });
    await page.getByTestId("save-address").click();
    h.check("address: required fields", (await dialog.innerText()).includes(COPY.en.required));
    const fields = dialog.locator("input");
    await fields.nth(0).fill("Noura Al-Qahtani");
    await fields.nth(1).fill("+966 55 000 9876");
    await fields.nth(2).fill("Olaya Street");
    await fields.nth(3).fill("Riyadh");
    await page.getByTestId("save-address").click();
    await dialog.waitFor({ state: "hidden" });
    h.check("address: saved, selected and toasted", (await page.getByText(COPY.en.saved).first().isVisible()) && (await page.getByTestId("address-disclosure").innerText()).includes("Noura Al-Qahtani"));
    h.check("address: priced, Pay enabled", await payEnabled(page));
    await close();
  }
  {
    // Pay: the processing steps, then the payment page for what remains.
    const { page, close } = await h.open("en", "/checkout?state=pickup");
    await payEnabled(page);
    await pay(page).click();
    h.check("pay: processing overlay", await page.getByTestId("processing-overlay").isVisible());
    await page.waitForURL(/\/payment\/moyasar\/9051/, { timeout: 15000 }).catch(() => {});
    h.check("pay: on to the payment page", /\/payment\/moyasar\/9051/.test(page.url()), page.url());
    await close();
  }
  {
    // Cancel checkout: confirm, the cart is emptied, on to Browse.
    const { page, close } = await h.open("en", "/checkout?state=pickup");
    await payEnabled(page);
    await page.getByTestId("cancel-checkout").click();
    await page.getByTestId("cancel-dialog").waitFor({ state: "visible" });
    await page.getByTestId("confirm-cancel").click();
    await page.waitForURL(/\/browse/, { timeout: 8000 }).catch(() => {});
    const count = await page.locator("header").getByRole("button", { name: /^Cart/ }).getAttribute("aria-label");
    h.check("cancel: cart emptied, on to Browse", /\/browse/.test(page.url()) && /\b0\b/.test(count || ""), `${page.url()} · ${count}`);
    await close();
  }
  {
    // A signed-out visitor is sent to sign in, returning to the cart.
    const { page, close } = await h.open("en", "/checkout", { signedOut: true });
    await page.waitForURL(/\/login\?next=(\/|%2F)cart/, { timeout: 8000 }).catch(() => {});
    h.check("signed out: redirected to /login?next=/cart", /\/login\?next=(\/|%2F)cart$/.test(page.url()), page.url());
    await close();
  }

  // Phones: the fixed pay bar replaces the summary's buttons.
  for (const width of [390, 320]) {
    const { page, errors, close } = await h.open("en", "/checkout?state=pickup", { width });
    await page.waitForTimeout(1800);
    h.check(`phone ${width}: pay bar shown, summary buttons hidden`, (await page.getByTestId("checkout-bar").isVisible()) && !(await pay(page).isVisible()));
    await h.audit(page, `checkout phone ${width}`, { errors, axe: width === 390 });
    await close();
  }
  {
    const { page, errors, close } = await h.open("ar", "/checkout", { width: 768 });
    await page.waitForTimeout(1800);
    await h.audit(page, "ar checkout tablet 768", { errors, axe: false });
    await close();
  }
}
