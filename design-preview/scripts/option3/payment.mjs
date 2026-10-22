// Payment pages: /payment/moyasar/[id] (the record's number and amount, the
// container Moyasar's card form mounts in — no imitation card fields — the
// loading, record-failure and provider-failure states, the way back and the
// card-data note) and /payment/result (verifying, paid with the redirect,
// still processing, not completed, signed out, verification failed, a
// missing reference), and the whole way from checkout to the orders page.
const COPY = {
  en: {
    title: "Pay online",
    loading: "Loading payment...",
    provider: "Unable to load online payment.",
    note: "Your card details are handled by the secure payment service.",
    verifying: "Verifying your payment...",
    paid: "Payment completed",
    pending: "Payment is being verified",
    failed: "Payment was not completed",
    verifyFailed: "Payment verification failed",
    signedOut: "Please log in again to verify this payment.",
    missing: "Payment reference is missing from the return URL.",
    returnToCheckout: "Return to checkout",
    viewOrders: "View orders",
  },
  ar: {
    title: "الدفع الإلكتروني",
    loading: "جارٍ تحميل الدفعة...",
    provider: "تعذّر تحميل الدفع الإلكتروني.",
    note: "تتولى خدمة الدفع الآمنة بيانات بطاقتك",
    verifying: "جارٍ التحقق من دفعتك...",
    paid: "اكتمل الدفع",
    pending: "جارٍ التحقق من الدفع",
    failed: "لم يكتمل الدفع",
    verifyFailed: "تعذّر التحقق من الدفع",
    signedOut: "يُرجى تسجيل الدخول مرة أخرى للتحقق من هذه الدفعة.",
    missing: "مرجع الدفع غير موجود في رابط العودة.",
    returnToCheckout: "العودة إلى إتمام الطلب",
    viewOrders: "عرض الطلبات",
  },
};

const RESULT = "/payment/result?payment_record_id=9051";
const clean = (value) => (value || "").replace(/[⁦-⁩]/g, "");

async function settle(page, ms = 1500) {
  await page.waitForTimeout(ms);
}

export default async function payment(h) {
  for (const lang of ["en", "ar"]) {
    const c = COPY[lang];

    {
      const { page, errors, close } = await h.open(lang, "/payment/moyasar/9051");
      await settle(page);
      const summary = clean(await page.getByTestId("payment-summary").innerText());
      h.check(`${lang} card payment: record number and amount`, summary.includes("PAY-20261022-1A2B3C4D") && summary.includes("725.00"), summary.replace(/\s+/g, " "));
      const mount = page.getByTestId("card-form-mount");
      h.check(`${lang} card payment: Moyasar's form container, no card fields of its own`, (await mount.isVisible()) && (await mount.locator("input").count()) === 0 && (await page.locator('#khaznah-moyasar-form').count()) === 1);
      const back = await page.getByTestId("return-to-checkout").getAttribute("href");
      h.check(`${lang} card payment: Return to checkout`, /\/concept-c\/checkout$/.test(back || ""), back);
      h.check(`${lang} card payment: card-data note`, (await h.mainText(page)).includes(c.note));
      await h.audit(page, `${lang} card payment`, { errors });
      await close();
    }
    {
      const { page, errors, close } = await h.open(lang, "/payment/moyasar/9051?state=loading");
      await settle(page);
      h.check(`${lang} card payment loading: announced, no summary`, (await page.getByTestId("payment-loading").innerText()).includes(c.loading) && (await page.getByTestId("payment-summary").count()) === 0);
      await h.audit(page, `${lang} card payment loading`, { errors, axe: false });
      await close();
    }
    {
      const { page, errors, close } = await h.open(lang, "/payment/moyasar/9051?state=provider-error");
      await settle(page);
      h.check(`${lang} provider failure: message, summary kept, no form`, (await page.getByTestId("payment-error").innerText()).includes(c.provider) && (await page.getByTestId("payment-summary").count()) === 1 && (await page.getByTestId("preview-controls").count()) === 0);
      await h.audit(page, `${lang} card payment provider failure`, { errors });
      await close();
    }
    {
      const { page, errors, close } = await h.open(lang, "/payment/moyasar/9051?state=error");
      await settle(page);
      h.check(`${lang} record failure: server message, no summary`, (await page.getByTestId("payment-error").innerText()).includes("Not found.") && (await page.getByTestId("payment-summary").count()) === 0);
      await h.audit(page, `${lang} card payment record failure`, { errors, axe: false });
      await close();
    }

    const states = [
      { state: "verifying", title: c.verifying, primary: c.viewOrders },
      { state: "paid", title: c.paid, primary: c.viewOrders, href: /\/account\?tab=orders&group=GRP-000123$/ },
      { state: "pending", title: c.pending, primary: c.returnToCheckout, href: /\/checkout$/ },
      { state: "failed", title: c.failed, primary: c.returnToCheckout, href: /\/checkout$/ },
      { state: "signed-out", title: c.verifyFailed, text: c.signedOut, primary: c.viewOrders, href: /\/dashboard\/orders$/, noWallet: true },
      { state: "error", title: c.verifyFailed, text: "Moyasar: Unable to reach Moyasar for payment verification.", primary: c.viewOrders },
    ];
    for (const entry of states) {
      const { page, errors, close } = await h.open(lang, `${RESULT}&state=${entry.state}`);
      await settle(page);
      const card = page.getByTestId("payment-result");
      const body = clean(await card.innerText());
      const primary = page.getByTestId("result-primary");
      const href = await primary.getAttribute("href");
      const wallet = await page.getByTestId("result-wallet").count();
      h.check(`${lang} result ${entry.state}: heading`, (await page.locator("h1").innerText()).includes(entry.title), await page.locator("h1").innerText());
      if (entry.text) h.check(`${lang} result ${entry.state}: message`, body.includes(entry.text));
      h.check(`${lang} result ${entry.state}: next action`, (await primary.innerText()).includes(entry.primary) && (!entry.href || entry.href.test(href || "")), `${await primary.innerText()} → ${href}`);
      h.check(`${lang} result ${entry.state}: Wallet for buyers only`, entry.noWallet ? wallet === 0 : wallet === 1);
      if (entry.state === "paid") h.check(`${lang} result paid: record line and redirect`, body.includes("PAY-20261022-1A2B3C4D") && (await page.getByTestId("result-redirecting").isVisible()));
      await h.audit(page, `${lang} result ${entry.state}`, { errors, axe: entry.state === "paid" || entry.state === "failed" });
      await close();
    }
    {
      const { page, close } = await h.open(lang, "/payment/result");
      await settle(page);
      h.check(`${lang} result: missing reference`, clean(await page.getByTestId("payment-result").innerText()).includes(c.missing));
      await close();
    }
  }

  // Simulated provider outcomes from the card page.
  {
    const { page, close } = await h.open("en", "/payment/moyasar/9051");
    await settle(page);
    await page.getByTestId("simulate-declined").click();
    await page.waitForURL(/state=failed/, { timeout: 8000 }).catch(() => {});
    await settle(page, 1200);
    h.check("declined card: result not completed", (await page.locator("h1").innerText()).includes(COPY.en.failed));
    await close();
  }
  {
    // The whole way: checkout → Pay → card page with the reserved amount →
    // completed → verified → on to the orders page; the cart empties.
    const { page, close } = await h.open("en", "/checkout?state=pickup");
    await page.waitForFunction(() => !document.querySelector('[data-testid="pay-button"]')?.disabled, null, { timeout: 10000 }).catch(() => {});
    await page.getByTestId("pay-button").click();
    await page.waitForURL(/\/payment\/moyasar\/9051/, { timeout: 15000 }).catch(() => {});
    await settle(page);
    const amount = clean(await page.getByTestId("payment-summary").innerText().catch(() => ""));
    h.check("flow: card page shows the amount checkout reserved", amount.includes("327.00"), amount.replace(/\s+/g, " "));
    await page.getByTestId("simulate-paid").click();
    await page.waitForURL(/\/payment\/result/, { timeout: 8000 }).catch(() => {});
    h.check("flow: result verifies first", (await page.locator("h1").innerText()).includes(COPY.en.verifying));
    await page.waitForURL(/\/account\?tab=orders/, { timeout: 12000 }).catch(() => {});
    h.check("flow: paid, on to the order (single seller)", /\/account\?tab=orders&order=418$/.test(page.url()), page.url());
    // The paid result empties the cart and ends the reservation in one step.
    h.check("flow: the reservation ends after payment", (await page.evaluate(() => sessionStorage.getItem("kz-checkout-session"))) === null);
    await close();
  }

  for (const width of [390, 320]) {
    for (const route of ["/payment/moyasar/9051", `${RESULT}&state=paid`]) {
      const { page, errors, close } = await h.open("ar", route, { width });
      await settle(page);
      await h.audit(page, `ar ${route.split("?")[0]} at ${width}`, { errors, axe: width === 390 });
      await close();
    }
  }
}
