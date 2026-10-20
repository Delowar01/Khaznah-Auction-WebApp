#!/usr/bin/env node
// Option 3 checks for the approved customer changes: the home hero cards
// and the winner moment (Auction Detail and Live Auction).
//
//   npm run build && npm run start            (serves on http://localhost:3100)
//   npm run verify:option3 -- [--base http://localhost:3100] [--only cards|winner]
//
// Hero cards: each language shows its own three pictures; each card is one
// link to its existing route (Enter opens it) with its accessible name and
// a decorative picture; none of the old tile labels, buttons or arrows are
// left; at 1920–320 px the words, button, products and live dot of every
// picture stay inside the card; no sideways scroll; a visible focus ring.
//
// Winner moment:
// the preview's auctions count down from page load. Timed lots are moved
// to just before their close by shifting the page clock's reading
// (performance.now) in the browser; everything else — the auction's own
// timers, the live room and the moment itself — runs in real time, with
// fixed randomness for the simulated rival bidders. Checks: no
// moment before a lot closes, on lots already closed, after Buy Now or for
// a live lot sold to someone else; the personal moment for the winner
// (English and Arabic, timed and live); "Auction completed" with the
// public winning bidder for everyone else, and no private details; one
// play only (re-renders, time passing, focus changes, resizing, leaving
// and coming back); focus never moves; reduced motion (no flecks); phone
// width (inside the screen, no sideways scroll). Exits 1 on any failure.
import { chromium } from "@playwright/test";
import fs from "node:fs";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const BASE = opt("base", process.env.PREVIEW_URL || "http://localhost:3100");
const ONLY = opt("only", "");
const SEAT_COVERS_CLOSE = 9 * 60 + 12; // data/products.js: the lot closes 9 min 12 s after the page opens

const executablePath = fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
const browser = await chromium.launch({ executablePath });
let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
  if (!ok) failures += 1;
}

const COPY = {
  en: { setMax: "Set a maximum bid", max: "Maximum bid", save: "Save maximum", won: "AUCTION WON", hello: "Congratulations, Faisal!", line: "You're the winner!", completed: "AUCTION COMPLETED", to: "Congratulations to ", bidder: "Bidder ", winningBidder: "Winning bidder" },
  ar: { setMax: "حدّد حداً أقصى للمزايدة", max: "الحد الأقصى للمزايدة", save: "حفظ الحد الأقصى", won: "تم الفوز بالمزاد", hello: "مبروك، فيصل!", line: "أنت الفائز بالمزاد!", completed: "انتهى المزاد", to: "مبروك لـ ", bidder: "مزايد ", winningBidder: "صاحب المزايدة الفائزة" },
};
// Never shown to anyone in the moment except the winner's own first name.
const PRIVATE = [/Al-Harbi/i, /الحربي/, /@/, /\+?966/, /\b05\d{8}\b/, /\bFH\b/, /ف ح/];

async function open(path, { width = 1440, height = 900, reducedMotion = "no-preference" } = {}) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion });
  await context.addInitScript(() => {
    // Rival bidders: timed rivals answer slowly, live rivals never bid.
    Math.random = () => 0.99;
    // Lets a test move the page clock (lib/clock.js) forward.
    const now = performance.now.bind(performance);
    window.__skip = 0;
    performance.now = () => now() + window.__skip;
    try {
      localStorage.setItem("kz-pbar", "hidden");
    } catch {}
    window.__moments = 0;
    new MutationObserver((records) => {
      for (const record of records)
        for (const node of record.addedNodes)
          if (node.nodeType === 1 && (node.matches('[data-testid="winner-celebration"]') || node.querySelector('[data-testid="winner-celebration"]'))) window.__moments += 1;
    }).observe(document, { childList: true, subtree: true });
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  return { context, page, errors };
}

/** Moves the page clock forward (the auction countdowns read it). */
const skip = (page, seconds) => page.evaluate((ms) => (window.__skip += ms), seconds * 1000);

const moment = (page) => page.locator('[data-testid="winner-celebration"]');
const plays = (page) => page.evaluate(() => window.__moments);
const settle = (page) => page.waitForTimeout(120);

/** Waits until the moment shows (or `limit` ms pass); returns the wait, or -1. */
async function untilMoment(page, limit) {
  const start = Date.now();
  while (Date.now() - start <= limit) {
    if (await moment(page).count()) return Date.now() - start;
    await page.waitForTimeout(100);
  }
  return -1;
}

/** Waits until the moment has gone; returns how long it was on screen (ms), or -1. */
async function untilGone(page, shownAt, limit = 6000) {
  while (Date.now() - shownAt <= limit) {
    if (!(await moment(page).count())) return Date.now() - shownAt;
    await page.waitForTimeout(100);
  }
  return -1;
}

async function noPrivateDetails(page, label) {
  const text = await moment(page).innerText();
  const leaks = PRIVATE.filter((re) => re.test(text)).map(String);
  check(`${label}: no private details`, leaks.length === 0, leaks.join(", "));
}

/** Customer keeps the lead with a high maximum bid (the proxy answers rivals); phones use the bid sheet. */
async function setMaxBid(page, lang, phone = false) {
  const c = COPY[lang];
  let scope = page.locator("#main");
  if (phone) {
    await page.locator('[data-testid="open-bid-sheet"]').click();
    scope = page.getByTestId("bid-sheet");
  }
  await scope.getByRole("button", { name: c.setMax }).click();
  await scope.getByLabel(c.max, { exact: true }).fill("5000");
  await scope.getByRole("button", { name: c.save, exact: true }).click();
  await settle(page);
  if (phone) await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
}

async function timedWinner(lang, { width = 1440, height = 900, reducedMotion } = {}) {
  const c = COPY[lang];
  const tag = `timed ${lang} ${width}${reducedMotion === "reduce" ? " reduced-motion" : ""}`;
  const { context, page, errors } = await open(`/${lang}/concept-c/auction/seat-covers`, { width, height, reducedMotion });
  check(`${tag}: nothing while the lot is open`, (await moment(page).count()) === 0);
  await setMaxBid(page, lang, width < 768);

  // A few seconds before the close: still nothing.
  await skip(page, SEAT_COVERS_CLOSE - 10);
  await page.waitForTimeout(600);
  check(`${tag}: nothing just before the close`, (await moment(page).count()) === 0);

  const focused = width < 768 ? null : await page.evaluate(() => {
    const share = document.querySelector('[data-testid="share-button"]');
    share.focus();
    return document.activeElement === share;
  });
  const after = await untilMoment(page, 20_000);
  const shownAt = Date.now();
  check(`${tag}: plays when the lot closes`, after >= 0);
  if (after < 0) return context.close();
  check(`${tag}: personal moment`, (await moment(page).getAttribute("data-kind")) === "won");
  const text = await moment(page).innerText();
  check(`${tag}: message`, text.includes(c.won) && text.includes(c.hello) && text.includes(c.line), text.replace(/\s+/g, " ").slice(0, 160));
  const bdi = await moment(page).locator("bdi").innerText();
  check(`${tag}: name isolated in <bdi>`, bdi === (lang === "ar" ? "فيصل" : "Faisal"), bdi);
  check(`${tag}: direction`, (await moment(page).evaluate((el) => getComputedStyle(el).direction)) === (lang === "ar" ? "rtl" : "ltr"));
  await noPrivateDetails(page, tag);
  const spoken = await page.locator('p[role="status"]').filter({ hasText: c.hello }).count();
  check(`${tag}: greeting announced`, spoken === 1);
  check(`${tag}: nothing to focus or click on it`, (await moment(page).locator("a, button, input, [tabindex]").count()) === 0 && (await moment(page).evaluate((el) => getComputedStyle(el).pointerEvents)) === "none");
  if (focused) check(`${tag}: focus stays where it was`, await page.evaluate(() => document.activeElement?.dataset.testid === "share-button"));
  const flecks = await moment(page).locator(".vd-fleck").count();
  check(`${tag}: ${reducedMotion === "reduce" ? "no flecks" : "gold flecks"}`, reducedMotion === "reduce" ? flecks === 0 : flecks > 0, `${flecks}`);
  if (width < 768) {
    const box = await moment(page).locator(".rounded-\\[28px\\]").boundingBox();
    check(`${tag}: card inside the screen`, box && box.x >= 0 && box.x + box.width <= width && box.y >= 0 && box.y + box.height <= height, JSON.stringify(box));
    check(`${tag}: no sideways scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  }

  const shown = await untilGone(page, shownAt);
  check(`${tag}: gone after about 3.5 s`, shown >= 3000 && shown <= 4500, `${shown} ms`);
  check(`${tag}: closed lot stays as it was`, (await page.getByText(c.winningBidder).count()) > 0);

  // No replay: time passing (the page re-renders every second), focus changes, resizing.
  await skip(page, 3600);
  await page.evaluate(() => {
    window.dispatchEvent(new Event("blur"));
    window.dispatchEvent(new Event("focus"));
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.setViewportSize({ width: width >= 1024 ? 1024 : 390, height });
  await page.waitForTimeout(2500);
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(2500);
  check(`${tag}: played once`, (await plays(page)) === 1 && (await moment(page).count()) === 0, `plays ${await plays(page)}`);
  check(`${tag}: no page errors`, errors.length === 0, errors.join(" | ").slice(0, 200));
  await context.close();
}

async function timedOtherViewer(lang) {
  const c = COPY[lang];
  const tag = `timed ${lang} other viewer`;
  const { context, page, errors } = await open(`/${lang}/concept-c/auction/seat-covers`);
  await skip(page, SEAT_COVERS_CLOSE - 6);
  const after = await untilMoment(page, 20_000);
  const shownAt = Date.now();
  check(`${tag}: plays when the lot closes`, after >= 0);
  if (after < 0) return context.close();
  check(`${tag}: "completed" moment`, (await moment(page).getAttribute("data-kind")) === "completed");
  const text = await moment(page).innerText();
  const name = await moment(page).locator("bdi").innerText();
  check(`${tag}: message`, text.includes(c.completed) && text.includes(c.to) && name.startsWith(c.bidder) && !text.includes(c.hello), text.replace(/\s+/g, " ").slice(0, 160));
  // The same public label the closed bid card shows as the winning bidder.
  const card = await page.getByText(c.winningBidder).first().locator("..").innerText();
  check(`${tag}: same public winning bidder as the bid card`, card.includes(name), `${name} / ${card.replace(/\s+/g, " ")}`);
  await noPrivateDetails(page, tag);
  check(`${tag}: gavel, no flecks`, (await moment(page).locator(".vd-fleck").count()) === 0);
  await untilGone(page, shownAt);
  await skip(page, 600);
  await page.waitForTimeout(3000);
  check(`${tag}: played once`, (await plays(page)) === 1 && (await moment(page).count()) === 0);
  check(`${tag}: no page errors`, errors.length === 0, errors.join(" | ").slice(0, 200));
  await context.close();
}

async function leaveAndReturn() {
  const tag = "timed en: leave and come back";
  const { context, page } = await open("/en/concept-c/auction/seat-covers");
  await skip(page, SEAT_COVERS_CLOSE - 6);
  await untilMoment(page, 20_000);
  await untilGone(page, Date.now());
  // Client-side to the Auctions list and back: the lot is already closed, so no moment.
  await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Auctions" }).click();
  await page.waitForURL(/\/browse/);
  await page.waitForTimeout(1500);
  await page.goBack();
  await page.waitForURL(/seat-covers/);
  await page.waitForTimeout(5000);
  check(`${tag}: no replay`, (await plays(page)) === 1 && (await moment(page).count()) === 0, `plays ${await plays(page)}`);
  await context.close();
}

async function neverPlays(path, label, act) {
  const { context, page, errors } = await open(path);
  if (act) await act(page);
  await page.waitForTimeout(4000);
  check(`${label}: no moment`, (await plays(page)) === 0);
  check(`${label}: no page errors`, errors.length === 0, errors.join(" | ").slice(0, 200));
  await context.close();
}

async function liveWinner(lang, { width = 1440, height = 900 } = {}) {
  const c = COPY[lang];
  const tag = `live ${lang} ${width}`;
  const { context, page, errors } = await open(`/${lang}/concept-c/live-auction`, { width, height });
  check(`${tag}: nothing while the lot is open`, (await moment(page).count()) === 0);
  await page.locator(width < 1024 ? '[data-testid="live-bid-bar"]' : '[data-testid="live-bid"]:visible').first().click();
  const after = await untilMoment(page, 45_000);
  const shownAt = Date.now();
  check(`${tag}: plays when the hammer falls on your lot`, after >= 0);
  if (after < 0) return context.close();
  check(`${tag}: personal moment`, (await moment(page).getAttribute("data-kind")) === "won");
  const text = await moment(page).innerText();
  check(`${tag}: message`, text.includes(c.won) && text.includes(c.hello) && text.includes(c.line), text.replace(/\s+/g, " ").slice(0, 160));
  await noPrivateDetails(page, tag);
  if (width < 768) {
    const box = await moment(page).locator(".rounded-\\[28px\\]").boundingBox();
    check(`${tag}: card inside the screen`, box && box.x >= 0 && box.x + box.width <= width && box.y >= 0 && box.y + box.height <= height, JSON.stringify(box));
    check(`${tag}: no sideways scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  }
  const shown = await untilGone(page, shownAt);
  check(`${tag}: gone after about 3.5 s`, shown >= 3000 && shown <= 4500, `${shown} ms`);
  if (lang === "en" && width >= 1024) {
    // The next lot opens and is hammered without your bid: no second moment.
    await page.waitForTimeout(56_000);
  } else await page.waitForTimeout(3000);
  check(`${tag}: played once`, (await plays(page)) === 1, `plays ${await plays(page)}`);
  check(`${tag}: no page errors`, errors.length === 0, errors.join(" | ").slice(0, 200));
  await context.close();
}

// ── Hero cards ─────────────────────────────────────────────────────────────
const CARDS = {
  en: [
    { file: "option3-auction-en", route: "/en/concept-c/browse?tab=auction", name: "Auction — Explore timed auctions" },
    { file: "option3-buy-now-en", route: "/en/concept-c/browse?tab=buy_now", name: "Buy Now — Shop fixed-price items" },
    { file: "option3-live-auction-en", route: "/en/concept-c/live-auction", name: "Live Auction — Join live auctions" },
  ],
  ar: [
    { file: "option3-auction-ar", route: "/ar/concept-c/browse?tab=auction", name: "المزادات — استكشف المزادات المحددة بوقت" },
    { file: "option3-buy-now-ar", route: "/ar/concept-c/browse?tab=buy_now", name: "اشترِ الآن — تسوّق المنتجات بسعر ثابت" },
    { file: "option3-live-auction-ar", route: "/ar/concept-c/live-auction", name: "المزاد المباشر — انضم إلى المزادات المباشرة" },
  ],
};
// The part of each picture that must stay in view (words, button, products, live dot): [width, height, left, top, right, bottom].
const SAFE = {
  "option3-auction-en": [1254, 1254, 75, 95, 1190, 1185],
  "option3-auction-ar": [1254, 1254, 330, 95, 1190, 1185],
  "option3-buy-now-en": [1564, 1006, 85, 210, 1445, 700],
  "option3-buy-now-ar": [1565, 1005, 110, 210, 1495, 729],
  "option3-live-auction-en": [1564, 1006, 95, 255, 1290, 727],
  "option3-live-auction-ar": [1565, 1005, 252, 255, 1478, 732],
};
const OLD_LABELS = {
  en: ["Furniture", "Stylish picks", "Explore", "Electronics", "Top brands", "Home & Kitchen", "Everything for your home"],
  ar: ["الأثاث", "اختيارات أنيقة", "استكشف", "إلكترونيات", "علامات معروفة", "المنزل والمطبخ", "كل ما يحتاجه منزلك"],
};

async function openHome(lang, width, height = 900) {
  const context = await browser.newContext({ viewport: { width, height } });
  await context.addInitScript(() => {
    try {
      localStorage.setItem("kz-pbar", "hidden");
    } catch {}
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  await page.goto(`${BASE}/${lang}/concept-c`, { waitUntil: "networkidle" });
  await page.evaluate(() => Promise.all([...document.querySelectorAll(".vd-mode-art")].map((img) => (img.complete ? null : new Promise((done) => (img.onload = img.onerror = done))))));
  return { context, page, errors };
}

async function heroCards(lang) {
  const tag = `cards ${lang}`;
  const { context, page, errors } = await openHome(lang, 1440);
  const hero = page.locator('section[data-ref="03"]');
  const cards = await hero.locator("a.vd-mode").evaluateAll((links) =>
    links.map((a) => ({ href: a.getAttribute("href"), name: a.getAttribute("aria-label"), src: a.querySelector("img")?.currentSrc || "", alt: a.querySelector("img")?.getAttribute("alt"), text: a.textContent.trim(), loaded: (a.querySelector("img")?.naturalWidth || 0) > 0 })),
  );
  check(`${tag}: three cards`, cards.length === 3, `${cards.length}`);
  CARDS[lang].forEach((want, i) => {
    const got = cards[i] || {};
    check(`${tag}: card ${i + 1} picture is ${want.file}`, got.src.includes(`/${want.file}-`) && got.loaded, got.src);
    check(`${tag}: card ${i + 1} opens ${want.route}`, got.href === want.route, got.href);
    check(`${tag}: card ${i + 1} name`, got.name === want.name, got.name);
    check(`${tag}: card ${i + 1} picture is decorative, no extra text`, got.alt === "" && got.text === "");
  });
  const other = lang === "en" ? "-ar-" : "-en-";
  check(`${tag}: no picture from the other language`, cards.every((c) => !c.src.includes(other)));
  // Everything in the hero except the copy tile (its own buttons stay): only the three cards, with no words of their own.
  const tiles = hero.locator(":scope > div > :not(:first-child)");
  const tileText = (await tiles.allInnerTexts()).join(" ");
  const left = OLD_LABELS[lang].filter((label) => tileText.includes(label));
  check(`${tag}: old tile labels, buttons and arrows gone`, left.length === 0 && (await tiles.locator("svg, button, article, span, p").count()) === 0, left.join(", "));

  // Keyboard: Tab reaches each card (focus ring shows), Enter opens its route.
  for (const [i, want] of CARDS[lang].entries()) {
    await page.goto(`${BASE}/${lang}/concept-c`, { waitUntil: "networkidle" });
    await hero.locator("a.vd-mode").nth(i).focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    const ring = await page.evaluate(() => {
      const el = document.activeElement;
      const style = getComputedStyle(el);
      return { card: el.classList.contains("vd-mode"), width: parseFloat(style.outlineWidth), outline: style.outlineStyle };
    });
    check(`${tag}: card ${i + 1} focus ring`, ring.card && ring.width >= 3 && ring.outline !== "none", JSON.stringify(ring));
    await page.keyboard.press("Enter");
    await page.waitForURL((url) => `${url.pathname}${url.search}` === want.route, { timeout: 10_000 }).catch(() => {});
    const now = new URL(page.url());
    check(`${tag}: card ${i + 1} Enter opens its page`, `${now.pathname}${now.search}` === want.route, `${now.pathname}${now.search}`);
  }
  check(`${tag}: no page errors`, errors.length === 0, errors.join(" | ").slice(0, 200));
  await context.close();
}

async function heroFit(lang, width) {
  const { context, page } = await openHome(lang, width);
  const cards = await page.evaluate(() =>
    [...document.querySelectorAll('section[data-ref="03"] a.vd-mode')].map((a) => {
      const c = a.getBoundingClientRect();
      const img = a.querySelector(".vd-mode-art");
      const r = img.getBoundingClientRect();
      return { src: img.currentSrc, c: [c.left, c.top, c.width, c.height], r: [r.left, r.top, r.width, r.height] };
    }),
  );
  const margins = cards.map((card) => {
    const key = Object.keys(SAFE).find((name) => card.src.includes(`/${name}-`));
    const [iw, ih, x0, y0, x1, y1] = SAFE[key];
    const s = card.r[2] / iw;
    const dx = card.r[0] - card.c[0];
    const dy = card.r[1] - card.c[1];
    const ratio = card.r[2] / card.r[3];
    return { key, margin: Math.min(dx + x0 * s, card.c[2] - (dx + x1 * s), dy + y0 * s, card.c[3] - (dy + y1 * s)), distortion: Math.abs(ratio - iw / ih) };
  });
  const worst = Math.min(...margins.map((m) => m.margin));
  check(`cards ${lang} ${width}: words, button and products inside every card`, worst >= 10, margins.map((m) => `${m.key.replace("option3-", "")} ${m.margin.toFixed(1)}`).join(", "));
  check(`cards ${lang} ${width}: pictures not distorted`, margins.every((m) => m.distortion < 0.01));
  check(`cards ${lang} ${width}: no sideways scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  await context.close();
}

async function runCards() {
  await heroCards("en");
  await heroCards("ar");
  for (const lang of ["en", "ar"]) for (const width of [1920, 1440, 1366, 1280, 1200, 1100, 1024, 900, 768, 640, 430, 375, 320]) await heroFit(lang, width);
}

// ── Winner moment ──────────────────────────────────────────────────────────
async function runWinner() {
  await timedWinner("en");
  await timedWinner("ar");
  await timedWinner("en", { width: 375, height: 812 });
  await timedWinner("en", { reducedMotion: "reduce" });
  await timedOtherViewer("en");
  await timedOtherViewer("ar");
  await leaveAndReturn();
  await neverPlays("/en/concept-c/auction", "timed: featured lot still open");
  await neverPlays("/en/concept-c/auction/robot-vacuum", "timed: lot closed before the page opened");
  await neverPlays("/en/concept-c/auction/fridge-690", "timed: Buy Now closes the auction", async (page) => {
    await page.locator('[data-testid="buy-now"]').click();
    await page.locator('[data-testid="confirm-buy-now"]').click();
  });
  await neverPlays("/en/concept-c/live-auction", "live: lot sold to someone else", async (page) => {
    // The opening lot is hammered about 27 s after the page opens.
    await page.getByText("Sold!").first().waitFor({ timeout: 45_000 });
  });
  await liveWinner("en");
  await liveWinner("ar");
  await liveWinner("en", { width: 375, height: 812 });
}

if (ONLY !== "winner") await runCards();
if (ONLY !== "cards") await runWinner();

await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
