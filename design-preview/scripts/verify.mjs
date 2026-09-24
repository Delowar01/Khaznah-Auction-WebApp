#!/usr/bin/env node
// Automated QA for the design preview.
//
//   npm run build && npm run start      (serves on http://localhost:3100)
//   npm run verify -- [--concepts a,b] [--pages home,browse] [--langs en,ar]
//                     [--widths 1440,1024,768,390] [--shots] [--no-axe] [--interactions]
//
// For every route × language × viewport it records console errors, page
// errors, failed requests (e.g. broken images), horizontal overflow and axe
// accessibility violations (serious/critical). --interactions also exercises
// the shared data-testid hooks (mobile menu, filter drawer, bid flow, cart).
// Results: .verify/report.json, screenshots in .verify/shots/.
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const BASE = opt("base", process.env.PREVIEW_URL || "http://localhost:3100");
const CONCEPTS = opt("concepts", "a,b,c,d").split(",");
const LANGS = opt("langs", "en,ar").split(",");
const WIDTHS = opt("widths", "1440,1024,768,390").split(",").map(Number);
const PAGES = opt("pages", "home,browse,product,auction,live,seller,system").split(",");
const SHOTS = flag("shots");
const AXE = !flag("no-axe");
const INTERACTIONS = flag("interactions");
const OUT = path.resolve(".verify");

const PAGE_PATHS = {
  home: "",
  browse: "/browse",
  product: "/product",
  auction: "/auction",
  live: "/live-auction",
  seller: "/seller",
  system: "/system",
  pallet: "/auction/electronics-pallet",
  upcoming: "/auction/leather-sofa",
  sold: "/auction/robot-vacuum",
  soldout: "/product/tyre-inflator",
};

const HEIGHTS = { 1440: 900, 1024: 768, 768: 1024, 390: 844 };

fs.mkdirSync(path.join(OUT, "shots"), { recursive: true });

const executablePath = fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
const browser = await chromium.launch({ executablePath });
const results = [];
let problems = 0;

async function checkPage(page, url) {
  const consoleErrors = [];
  const failed = [];
  const onConsole = (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  };
  const onPageError = (err) => consoleErrors.push(`pageerror: ${err.message}`);
  const onResponse = (res) => {
    if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
  };
  const onFailed = (req) => {
    const reason = req.failure()?.errorText || "";
    // Requests the page itself cancelled (e.g. link prefetches) are not failures.
    if (reason.includes("ERR_ABORTED")) return;
    failed.push(`failed ${req.url()} ${reason}`);
  };
  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("response", onResponse);
  page.on("requestfailed", onFailed);
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(400);
  // Scroll through so lazy images load, then return to top.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle").catch(() => {});
  // Let scroll-reveal transitions finish so contrast is measured on final colours.
  await page.waitForTimeout(1200);
  const layout = await page.evaluate(() => {
    const doc = document.documentElement;
    const overflow = doc.scrollWidth - window.innerWidth;
    const offenders = [];
    if (overflow > 1) {
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1)) {
          const style = getComputedStyle(el);
          if (style.position === "fixed") continue;
          offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} [${Math.round(r.left)}→${Math.round(r.right)}]`);
          if (offenders.length > 5) break;
        }
      }
    }
    const brokenImages = [...document.images].filter((img) => img.complete && img.naturalWidth === 0 && img.src).map((img) => img.src);
    return { overflow, offenders, brokenImages, dir: doc.dir, lang: doc.lang, h1: document.querySelectorAll("h1").length };
  });
  let axe = [];
  if (AXE) {
    const res = await new AxeBuilder({ page }).disableRules(["region"]).analyze();
    axe = res.violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id} (${v.impact}) ×${v.nodes.length}: ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`);
  }
  page.off("console", onConsole);
  page.off("pageerror", onPageError);
  page.off("response", onResponse);
  page.off("requestfailed", onFailed);
  return { consoleErrors, failed, ...layout, axe };
}

async function interactions(page, width) {
  const notes = [];
  const click = async (testid) => {
    const el = page.getByTestId(testid).first();
    if (!(await el.count())) return false;
    if (!(await el.isVisible())) return false;
    await el.click();
    await page.waitForTimeout(450);
    return true;
  };
  if (width < 1024) {
    if (await click("mobile-menu-button")) {
      const open = await page.getByTestId("mobile-menu").first().isVisible().catch(() => false);
      notes.push(`mobile menu ${open ? "opens" : "DID NOT OPEN"}`);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
    } else notes.push("mobile-menu-button missing");
  }
  return notes;
}

for (const concept of CONCEPTS) {
  for (const lang of LANGS) {
    for (const key of PAGES) {
      const route = `/${lang}/concept-${concept}${PAGE_PATHS[key] ?? key}`;
      for (const width of WIDTHS) {
        const context = await browser.newContext({ viewport: { width, height: HEIGHTS[width] || 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
        const page = await context.newPage();
        const url = `${BASE}${route}`;
        let entry;
        try {
          entry = await checkPage(page, url);
          if (INTERACTIONS) entry.interactions = await interactions(page, width);
          if (SHOTS) {
            const safeKey = key.replace(/^[/?]+/, "").replace(/[^a-z0-9-]+/gi, "_") || "home";
            const file = path.join(OUT, "shots", `${concept}-${safeKey}-${lang}-${width}.png`);
            await page.screenshot({ path: file, fullPage: true, timeout: 60000 });
          }
        } catch (error) {
          entry = { fatal: String(error?.message || error) };
        }
        const issues =
          (entry.fatal ? 1 : 0) +
          (entry.consoleErrors?.length || 0) +
          (entry.failed?.length || 0) +
          (entry.overflow > 1 ? 1 : 0) +
          (entry.brokenImages?.length || 0) +
          (entry.axe?.length || 0);
        problems += issues;
        results.push({ route, width, ...entry });
        const status = issues ? `✗ ${issues}` : "✓";
        console.log(`${status.padEnd(5)} ${route} @${width}${entry.overflow > 1 ? ` overflow:${entry.overflow}px` : ""}`);
        if (issues) {
          for (const line of [
            ...(entry.fatal ? [entry.fatal] : []),
            ...(entry.consoleErrors || []).map((e) => `console: ${e}`),
            ...(entry.failed || []).map((e) => `request: ${e}`),
            ...(entry.brokenImages || []).map((e) => `broken image: ${e}`),
            ...(entry.offenders || []).map((e) => `overflow: ${e}`),
            ...(entry.axe || []).map((e) => `axe: ${e}`),
          ].slice(0, 12)) {
            console.log(`        ${line}`);
          }
        }
        if (entry.interactions?.length) console.log(`        interactions: ${entry.interactions.join("; ")}`);
        await context.close();
      }
    }
  }
}

await browser.close();
fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify({ base: BASE, problems, results }, null, 2));
console.log(`\n${results.length} checks, ${problems} issue(s). Report: .verify/report.json`);
process.exit(problems ? 1 : 0);
