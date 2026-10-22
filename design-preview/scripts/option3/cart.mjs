// Cart (/cart): the documented states, quantity rules (typing commits whole
// numbers, clamps to stock on blur, never removes a line), locked full-lot
// lines, remove with confirmation, blocked checkout, guest and signed-out
// visitors, and the phone bar.
const COPY = {
  en: {
    empty: "Your cart is empty",
    browse: "Browse Now",
    pallet: "Packed pallet · full lot required",
    confirm: "Remove Item?",
    removed: "Item removed from cart",
    blocked: "Update unavailable items before checkout",
    guest: "You're shopping as a guest",
    increase: /^Increase quantity/,
    retry: "Try again",
  },
  ar: {
    empty: "سلة التسوق فارغة",
    browse: "تصفح الآن",
    pallet: "منصة نقالة مغلقة · يجب شراء كامل الكمية",
    confirm: "هل تريد حذف المنتج؟",
    removed: "تم حذف المنتج من السلة",
    blocked: "حدّث المنتجات غير المتاحة قبل إتمام الشراء",
    guest: "أنت تتسوق كزائر",
    increase: /^زيادة كمية/,
    retry: "حاول مرة أخرى",
  },
};

const line = (page, slug) => page.locator(`[data-testid="cart-line"][data-slug="${slug}"]`);

export default async function cart(h) {
  for (const lang of ["en", "ar"]) {
    const c = COPY[lang];

    {
      const { page, errors, close } = await h.open(lang, "/cart?state=empty");
      const text = await h.mainText(page);
      h.check(`${lang} empty: production message`, text.includes(c.empty));
      const href = await page.locator("main").getByRole("link", { name: c.browse }).getAttribute("href");
      h.check(`${lang} empty: Browse Now opens Browse`, /\/concept-c\/browse$/.test(href || ""), href);
      await h.audit(page, `${lang} cart empty`, { errors });
      await close();
    }

    {
      const { page, errors, close } = await h.open(lang, "/cart?state=sample");
      h.check(`${lang} sample: five lines from the sample cart`, (await page.getByTestId("cart-line").count()) === 5);

      const pallet = line(page, "kitchen-pallet");
      const palletText = await pallet.innerText();
      h.check(
        `${lang} packed pallet: locked at the full lot, no remove`,
        (await pallet.getByTestId("remove-line").count()) === 0 && (await pallet.locator("input").count()) === 0 && palletText.includes(c.pallet),
      );

      const lamp = line(page, "task-lamp");
      const input = lamp.locator("input");
      await lamp.getByRole("button", { name: c.increase }).click();
      h.check(`${lang} quantity: + adds one`, (await input.inputValue()) === "3", await input.inputValue());
      await input.fill("");
      await input.blur();
      h.check(`${lang} quantity: an empty field returns to 1 on blur, the line stays`, (await input.inputValue()) === "1" && (await page.getByTestId("cart-line").count()) === 5, await input.inputValue());
      await input.fill("999");
      await input.blur();
      const max = await input.getAttribute("max");
      h.check(`${lang} quantity: clamped to stock`, (await input.inputValue()) === max, `${await input.inputValue()} / ${max}`);

      await line(page, "capsule-coffee").getByTestId("remove-line").click();
      const dialog = page.getByTestId("remove-dialog");
      await dialog.waitFor({ state: "visible" });
      h.check(`${lang} remove: asks first`, (await dialog.innerText()).includes(c.confirm));
      await page.keyboard.press("Escape");
      await dialog.waitFor({ state: "hidden" });
      h.check(`${lang} remove: Escape keeps the line`, (await page.getByTestId("cart-line").count()) === 5);
      await line(page, "capsule-coffee").getByTestId("remove-line").click();
      await page.getByTestId("confirm-remove").click();
      await page.waitForTimeout(400);
      h.check(`${lang} remove: confirmed removal`, (await page.getByTestId("cart-line").count()) === 4);
      h.check(`${lang} remove: toast`, await page.getByText(c.removed).first().isVisible());

      const proceed = await page.getByTestId("proceed-checkout").getAttribute("href");
      h.check(`${lang} proceed: opens checkout`, /\/concept-c\/checkout$/.test(proceed || ""), proceed);
      await h.audit(page, `${lang} cart sample`, { errors });
      await close();
    }

    {
      const { page, errors, close } = await h.open(lang, "/cart?state=attention");
      const blocked = page.getByTestId("checkout-blocked");
      h.check(`${lang} attention: checkout blocked`, (await blocked.isDisabled()) && (await blocked.innerText()).includes(c.blocked));
      h.check(`${lang} attention: no proceed link`, (await page.getByTestId("proceed-checkout").count()) === 0);
      await h.audit(page, `${lang} cart attention`, { errors });
      await close();
    }

    {
      const { page, errors, close } = await h.open(lang, "/cart?state=guest");
      h.check(`${lang} guest: guest note`, (await h.mainText(page)).includes(c.guest));
      const href = await page.getByTestId("proceed-checkout").getAttribute("href");
      h.check(`${lang} guest: checkout asks to sign in`, /\/checkout\?state=signed-out$/.test(href || ""), href);
      await h.audit(page, `${lang} cart guest`, { errors, axe: false });
      await close();
    }

    {
      const { page, close } = await h.open(lang, "/cart?state=sample", { signedOut: true });
      h.check(`${lang} signed out: treated as a guest`, (await h.mainText(page)).includes(c.guest));
      await close();
    }

    {
      const { page, errors, close } = await h.open(lang, "/cart?state=loading");
      h.check(`${lang} loading: announced`, (await page.locator('main [role="status"]').count()) > 0);
      await h.audit(page, `${lang} cart loading`, { errors, axe: false });
      await close();
    }

    {
      const { page, errors, close } = await h.open(lang, "/cart?state=error");
      h.check(`${lang} error: alert with retry`, (await page.locator('main [role="alert"]').count()) > 0 && (await page.getByRole("button", { name: c.retry }).count()) > 0);
      await h.audit(page, `${lang} cart error`, { errors });
      await close();
    }
  }

  for (const width of [390, 320]) {
    const { page, errors, close } = await h.open("en", "/cart?state=sample", { width });
    h.check(`phone ${width}: sticky checkout bar`, await page.getByTestId("cart-bar").isVisible());
    await h.audit(page, `cart phone ${width}`, { errors, axe: width === 390 });
    await close();
  }
}
